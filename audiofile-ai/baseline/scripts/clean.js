const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function labelWins(a, b) {
  if (!a && !b) return null;
  if (a && !b) return 'a';
  if (!a && b) return 'b';
  if ((a.count || 0) !== (b.count || 0)) return (a.count || 0) > (b.count || 0) ? 'a' : 'b';
  if ((a.avg_confidence || 0) !== (b.avg_confidence || 0)) return (a.avg_confidence || 0) > (b.avg_confidence || 0) ? 'a' : 'b';
  return 'a';
}

function isWeak(entry) {
  if (!entry) return true;
  if (typeof entry.count === 'number' && entry.count < 2) return true;
  return false;
}

function survives(entry) {
  return !!entry && !isWeak(entry);
}

function evidenceLevel(entry) {
  if (!entry || typeof entry.count !== 'number') return 'none';
  if (entry.count >= 4) return 'strong';
  if (entry.count >= 2) return 'medium';
  return 'weak';
}

function agreementFromCount(count, totalVotes) {
  if (!Number.isFinite(count) || !Number.isFinite(totalVotes) || totalVotes <= 0) return 0;
  return count / totalVotes;
}

function scoreFromEntry(entry, totalVotes) {
  const agreement = agreementFromCount(entry && entry.count, totalVotes);
  const confidence = entry && typeof entry.avg_confidence === 'number' ? entry.avg_confidence : 0;
  return { agreement, score: agreement * confidence, confidence };
}

function pushConflict(conflicts, dimension, labels, reason) {
  const cleanLabels = (labels || []).filter(Boolean);
  const key = `${dimension}::${cleanLabels.slice().sort().join('|')}`;
  const existingIdx = conflicts.findIndex((c) => {
    const cLabels = (c.labels || []).filter(Boolean);
    const cKey = `${c.dimension}::${cLabels.slice().sort().join('|')}`;
    return cKey === key;
  });

  if (existingIdx === -1) {
    conflicts.push({ dimension, labels: cleanLabels, reason });
    return;
  }

  // If we already recorded the same conflict (same dimension + same label set),
  // keep the most informative reason and avoid duplicates.
  const existing = conflicts[existingIdx];
  if (existing.reason === reason) return;
  conflicts[existingIdx] = { ...existing, reason };
}

function enforceDimensionLabelInvariants(accepted, candidate, dims) {
  const acceptedSet = new Set(accepted);

  // Dimension-defining labels should not appear in candidate if we already accepted a state.
  // (Articulation is intentionally multi-state; vocal_speech intentionally emits both vocal + speech.)
  const dimLabelSets = {
    energy: ['very_high_energy', 'high_energy', 'low_energy'],
    density: ['dense', 'sparse'],
    brightness: ['bright', 'dark'],
    rhythm: ['driving', 'steady'],
    content: ['instrumental']
  };

  const filteredCandidate = [];
  for (const l of candidate) {
    let drop = false;
    for (const [dim, labels] of Object.entries(dimLabelSets)) {
      if (!labels.includes(l)) continue;
      const acceptedInDim = labels.some((x) => acceptedSet.has(x));
      if (acceptedInDim) {
        drop = true;
        break;
      }

      // Also drop if the dimension ended ambiguous/unknown; candidates should not assert a dim label then.
      if (dims && dims[dim] && (dims[dim].status === 'ambiguous' || dims[dim].status === 'unknown')) {
        drop = true;
        break;
      }
    }
    if (!drop) filteredCandidate.push(l);
  }

  // Ensure at most one energy/density/brightness/rhythm/content label is accepted.
  // If something upstream ever violates this, deterministically keep the accepted dim state.
  const canonicalAccepted = [];
  const keepOne = (labels, canonical) => {
    const present = labels.filter((l) => acceptedSet.has(l));
    if (present.length <= 1) return;

    // Keep the canonical label (derived from dims) when possible.
    const keep = present.includes(canonical) ? canonical : present[0];
    for (const l of present) {
      if (l !== keep) acceptedSet.delete(l);
    }
  };

  if (dims && dims.energy && dims.energy.source_labels && dims.energy.source_labels.length === 1) {
    keepOne(dimLabelSets.energy, dims.energy.source_labels[0]);
  }
  if (dims && dims.density && dims.density.status === 'accepted') {
    keepOne(dimLabelSets.density, dims.density.state);
  }
  if (dims && dims.brightness && dims.brightness.status === 'accepted') {
    keepOne(dimLabelSets.brightness, dims.brightness.state);
  }
  if (dims && dims.rhythm && dims.rhythm.status === 'accepted') {
    keepOne(dimLabelSets.rhythm, dims.rhythm.state);
  }
  if (dims && dims.content && dims.content.status === 'accepted') {
    const canonical = dims.content.state === 'vocal_speech' ? null : dims.content.state;
    if (canonical && dimLabelSets.content.includes(canonical)) {
      keepOne(dimLabelSets.content, canonical);
    }
  }

  for (const l of acceptedSet) canonicalAccepted.push(l);

  return {
    accepted: canonicalAccepted,
    candidate: filteredCandidate
  };
}

function dimBase() {
  return {
    state: 'unknown',
    status: 'unknown',
    score: 0,
    confidence: 0,
    agreement: 0,
    source_labels: [],
    conflicts: []
  };
}

function dimArticulationBase() {
  return {
    states: [],
    status: 'unknown',
    score: 0,
    confidence: 0,
    agreement: 0,
    source_labels: [],
    conflicts: []
  };
}

function cleanOneSong(normalizedSong) {
  const song = normalizedSong.song;
  const labels = normalizedSong.labels || {};

  const accepted_labels = [];
  const candidate_labels = [];
  const rejected_labels = [];
  const resolved_labels = [];

  const conflicts = [];

  const totalVotes = 6;

  const dims = {
    energy: dimBase(),
    density: dimBase(),
    brightness: dimBase(),
    rhythm: dimBase(),
    content: dimBase(),
    articulation: dimArticulationBase()
  };

  const eVery = labels.very_high_energy;
  const eHigh = labels.high_energy;
  const eLow = labels.low_energy;

  const eVeryLvl = evidenceLevel(eVery);
  const eHighLvl = evidenceLevel(eHigh);
  const eLowLvl = evidenceLevel(eLow);

  const energyMediums = ['very_high_energy', 'high_energy', 'low_energy'].filter((k) => evidenceLevel(labels[k]) === 'medium');
  const energyStrongs = ['very_high_energy', 'high_energy', 'low_energy'].filter((k) => evidenceLevel(labels[k]) === 'strong');

  if (eVeryLvl === 'strong') {
    const s = scoreFromEntry(eVery, totalVotes);
    dims.energy = {
      state: 'very_high',
      status: 'accepted',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: ['very_high_energy'],
      conflicts: []
    };
    resolved_labels.push('very_high_energy');
  } else if (eHighLvl === 'strong') {
    const s = scoreFromEntry(eHigh, totalVotes);
    dims.energy = {
      state: 'high',
      status: 'accepted',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: ['high_energy'],
      conflicts: []
    };
    resolved_labels.push('high_energy');
  } else if (eLowLvl === 'strong') {
    const s = scoreFromEntry(eLow, totalVotes);
    dims.energy = {
      state: 'low',
      status: 'accepted',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: ['low_energy'],
      conflicts: []
    };
    resolved_labels.push('low_energy');
  } else if (energyMediums.length === 1) {
    const key = energyMediums[0];
    const entry = labels[key];
    const s = scoreFromEntry(entry, totalVotes);
    const state = key === 'very_high_energy' ? 'very_high' : key === 'high_energy' ? 'high' : 'low';
    dims.energy = {
      state,
      status: 'candidate',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: [key],
      conflicts: []
    };
  } else if (energyStrongs.length === 0 && energyMediums.length > 1) {
    dims.energy = {
      state: 'ambiguous',
      status: 'ambiguous',
      score: 0,
      confidence: 0,
      agreement: 0,
      source_labels: energyMediums,
      conflicts: [{ labels: energyMediums, reason: 'multiple medium energy signals' }]
    };
    pushConflict(conflicts, 'energy', energyMediums, 'multiple medium energy signals; marked ambiguous');
  }

  const dense = labels.dense;
  const sparse = labels.sparse;
  const denseLvl = evidenceLevel(dense);
  const sparseLvl = evidenceLevel(sparse);

  if (denseLvl === 'strong' && (sparseLvl === 'weak' || sparseLvl === 'none')) {
    const s = scoreFromEntry(dense, totalVotes);
    dims.density = { state: 'dense', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['dense'], conflicts: [] };
    resolved_labels.push('dense');
  } else if (sparseLvl === 'strong' && (denseLvl === 'weak' || denseLvl === 'none')) {
    const s = scoreFromEntry(sparse, totalVotes);
    dims.density = { state: 'sparse', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['sparse'], conflicts: [] };
    resolved_labels.push('sparse');
  } else if ((denseLvl === 'strong' && sparseLvl === 'medium') || (sparseLvl === 'strong' && denseLvl === 'medium')) {
    const strongKey = denseLvl === 'strong' ? 'dense' : 'sparse';
    const mediumKey = denseLvl === 'medium' ? 'dense' : 'sparse';
    const strongEntry = strongKey === 'dense' ? dense : sparse;
    const s = scoreFromEntry(strongEntry, totalVotes);
    dims.density = {
      state: strongKey,
      status: 'accepted',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: [strongKey, mediumKey],
      conflicts: [{ labels: [strongKey, mediumKey], reason: 'strong vs medium conflict' }]
    };
    pushConflict(conflicts, 'density', [strongKey, mediumKey], 'strong vs medium conflict');
    resolved_labels.push(strongKey);
  } else if (denseLvl === 'medium' && sparseLvl === 'medium') {
    dims.density = {
      state: 'ambiguous',
      status: 'ambiguous',
      score: 0,
      confidence: 0,
      agreement: 0,
      source_labels: ['dense', 'sparse'],
      conflicts: [{ labels: ['dense', 'sparse'], reason: 'both medium evidence; marked ambiguous' }]
    };
    pushConflict(conflicts, 'density', ['dense', 'sparse'], 'both medium evidence; marked ambiguous');
  } else if (denseLvl === 'medium' && (sparseLvl === 'weak' || sparseLvl === 'none')) {
    const s = scoreFromEntry(dense, totalVotes);
    dims.density = { state: 'dense', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['dense'], conflicts: [] };
  } else if (sparseLvl === 'medium' && (denseLvl === 'weak' || denseLvl === 'none')) {
    const s = scoreFromEntry(sparse, totalVotes);
    dims.density = { state: 'sparse', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['sparse'], conflicts: [] };
  }

  const bright = labels.bright;
  const dark = labels.dark;
  const brightLvl = evidenceLevel(bright);
  const darkLvl = evidenceLevel(dark);

  if (brightLvl === 'strong' && (darkLvl === 'weak' || darkLvl === 'none')) {
    const s = scoreFromEntry(bright, totalVotes);
    dims.brightness = { state: 'bright', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['bright'], conflicts: [] };
    resolved_labels.push('bright');
  } else if (darkLvl === 'strong' && (brightLvl === 'weak' || brightLvl === 'none')) {
    const s = scoreFromEntry(dark, totalVotes);
    dims.brightness = { state: 'dark', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['dark'], conflicts: [] };
    resolved_labels.push('dark');
  } else if ((brightLvl === 'strong' && darkLvl === 'medium') || (darkLvl === 'strong' && brightLvl === 'medium')) {
    const strongKey = brightLvl === 'strong' ? 'bright' : 'dark';
    const mediumKey = brightLvl === 'medium' ? 'bright' : 'dark';
    const strongEntry = strongKey === 'bright' ? bright : dark;
    const s = scoreFromEntry(strongEntry, totalVotes);
    dims.brightness = {
      state: strongKey,
      status: 'accepted',
      score: s.score,
      confidence: s.confidence,
      agreement: s.agreement,
      source_labels: [strongKey, mediumKey],
      conflicts: [{ labels: [strongKey, mediumKey], reason: 'strong vs medium conflict' }]
    };
    pushConflict(conflicts, 'brightness', [strongKey, mediumKey], 'strong vs medium conflict');
    resolved_labels.push(strongKey);
  } else if (brightLvl === 'medium' && darkLvl === 'medium') {
    dims.brightness = {
      state: 'ambiguous',
      status: 'ambiguous',
      score: 0,
      confidence: 0,
      agreement: 0,
      source_labels: ['bright', 'dark'],
      conflicts: [{ labels: ['bright', 'dark'], reason: 'both medium evidence; marked ambiguous' }]
    };
    pushConflict(conflicts, 'brightness', ['bright', 'dark'], 'both medium evidence; marked ambiguous');
  } else if (brightLvl === 'medium' && (darkLvl === 'weak' || darkLvl === 'none')) {
    const s = scoreFromEntry(bright, totalVotes);
    dims.brightness = { state: 'bright', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['bright'], conflicts: [] };
  } else if (darkLvl === 'medium' && (brightLvl === 'weak' || brightLvl === 'none')) {
    const s = scoreFromEntry(dark, totalVotes);
    dims.brightness = { state: 'dark', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['dark'], conflicts: [] };
  }

  const driving = labels.driving;
  const steady = labels.steady;
  const drivingLvl = evidenceLevel(driving);
  const steadyLvl = evidenceLevel(steady);

  if (drivingLvl === 'strong') {
    const s = scoreFromEntry(driving, totalVotes);
    dims.rhythm = { state: 'driving', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['driving'], conflicts: [] };
    resolved_labels.push('driving');
  } else if (steadyLvl === 'strong' && (drivingLvl === 'weak' || drivingLvl === 'none')) {
    const s = scoreFromEntry(steady, totalVotes);
    dims.rhythm = { state: 'steady', status: 'accepted', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['steady'], conflicts: [] };
    resolved_labels.push('steady');
  } else if (drivingLvl === 'medium' && (steadyLvl === 'weak' || steadyLvl === 'none')) {
    const s = scoreFromEntry(driving, totalVotes);
    dims.rhythm = { state: 'driving', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['driving'], conflicts: [] };
  } else if (steadyLvl === 'medium' && (drivingLvl === 'weak' || drivingLvl === 'none')) {
    const s = scoreFromEntry(steady, totalVotes);
    dims.rhythm = { state: 'steady', status: 'candidate', score: s.score, confidence: s.confidence, agreement: s.agreement, source_labels: ['steady'], conflicts: [] };
  } else if (drivingLvl === 'medium' && steadyLvl === 'medium') {
    const w = labelWins(driving, steady);
    const drivingClearlyBetter = w === 'a' && (driving.count > steady.count || driving.avg_confidence > steady.avg_confidence + 0.1);
    if (drivingClearlyBetter) {
      const s = scoreFromEntry(driving, totalVotes);
      dims.rhythm = {
        state: 'driving',
        status: 'candidate',
        score: s.score,
        confidence: s.confidence,
        agreement: s.agreement,
        source_labels: ['driving', 'steady'],
        conflicts: [{ labels: ['driving', 'steady'], reason: 'both medium; driving marginally stronger' }]
      };
      pushConflict(conflicts, 'rhythm', ['driving', 'steady'], 'both medium; driving marginally stronger');
    } else {
      dims.rhythm = {
        state: 'ambiguous',
        status: 'ambiguous',
        score: 0,
        confidence: 0,
        agreement: 0,
        source_labels: ['driving', 'steady'],
        conflicts: [{ labels: ['driving', 'steady'], reason: 'both medium evidence; marked ambiguous' }]
      };
      pushConflict(conflicts, 'rhythm', ['driving', 'steady'], 'both medium evidence; marked ambiguous');
    }
  }

  const vocal = labels.vocal;
  const instrumental = labels.instrumental;
  const speech = labels.speech;

  const vocalOk = survives(vocal);
  const speechOk = survives(speech);
  const instOk = survives(instrumental);

  const vocalLvl = evidenceLevel(vocal);
  const speechLvl = evidenceLevel(speech);
  const instLvl = evidenceLevel(instrumental);

  if (instOk && vocalOk && speechOk) {
    const wV = labelWins(instrumental, vocal);
    const wS = labelWins(instrumental, speech);
    if (wV === 'a' && wS === 'a') {
      const s = scoreFromEntry(instrumental, totalVotes);
      dims.content = { state: 'instrumental', score: s.score, confidence: s.confidence, source_labels: ['instrumental', 'vocal', 'speech'] };
    } else {
      const s1 = scoreFromEntry(vocal, totalVotes);
      const s2 = scoreFromEntry(speech, totalVotes);
      dims.content = {
        state: 'vocal_speech',
        score: (s1.score + s2.score) / 2,
        confidence: (s1.confidence + s2.confidence) / 2,
        source_labels: ['instrumental', 'vocal', 'speech']
      };
    }
  } else if (vocalOk && speechOk) {
    const s1 = scoreFromEntry(vocal, totalVotes);
    const s2 = scoreFromEntry(speech, totalVotes);
    dims.content = {
      state: 'vocal_speech',
      score: (s1.score + s2.score) / 2,
      confidence: (s1.confidence + s2.confidence) / 2,
      source_labels: ['vocal', 'speech']
    };
  } else if (instOk && vocalOk) {
    const w = labelWins(instrumental, vocal);
    const chosen = w === 'a' ? instrumental : vocal;
    const chosenLabel = w === 'a' ? 'instrumental' : 'vocal';
    const s = scoreFromEntry(chosen, totalVotes);
    dims.content = { state: chosenLabel, score: s.score, confidence: s.confidence, source_labels: ['instrumental', 'vocal'] };
  } else if (instOk && speechOk) {
    const w = labelWins(instrumental, speech);
    const chosen = w === 'a' ? instrumental : speech;
    const chosenLabel = w === 'a' ? 'instrumental' : 'speech';
    const s = scoreFromEntry(chosen, totalVotes);
    dims.content = { state: chosenLabel, score: s.score, confidence: s.confidence, source_labels: ['instrumental', 'speech'] };
  } else if (instOk) {
    const s = scoreFromEntry(instrumental, totalVotes);
    dims.content = { state: 'instrumental', score: s.score, confidence: s.confidence, source_labels: ['instrumental'] };
  } else if (vocalOk) {
    const s = scoreFromEntry(vocal, totalVotes);
    dims.content = { state: 'vocal', score: s.score, confidence: s.confidence, source_labels: ['vocal'] };
  } else if (speechOk) {
    const s = scoreFromEntry(speech, totalVotes);
    dims.content = { state: 'speech', score: s.score, confidence: s.confidence, source_labels: ['speech'] };
  }

  if (dims.content.state === 'instrumental' && (vocalOk || speechOk)) {
    // Conflict logging must reflect the FINAL decision. We log "resolved" only if the
    // content dimension ultimately stays accepted as instrumental.
  }

  if (dims.content && dims.content.state) {
    if (dims.content.state === 'instrumental') {
      if (instLvl === 'strong' && (vocalLvl === 'weak' || vocalLvl === 'none') && (speechLvl === 'weak' || speechLvl === 'none')) {
        dims.content.status = 'accepted';
        resolved_labels.push('instrumental');
      } else if (instLvl === 'medium' && (vocalLvl === 'weak' || vocalLvl === 'none') && (speechLvl === 'weak' || speechLvl === 'none')) {
        dims.content.status = 'candidate';
      } else if (instLvl === 'strong' && (vocalLvl === 'medium' || speechLvl === 'medium')) {
        dims.content.status = 'accepted';
        resolved_labels.push('instrumental');
        dims.content.conflicts = [{ labels: ['instrumental', vocalLvl !== 'none' ? 'vocal' : null, speechLvl !== 'none' ? 'speech' : null].filter(Boolean), reason: 'instrumental strong vs competing medium' }];
        pushConflict(conflicts, 'content', ['instrumental', vocalLvl !== 'none' ? 'vocal' : null, speechLvl !== 'none' ? 'speech' : null].filter(Boolean), 'content conflict resolved to instrumental');
      } else {
        dims.content.status = 'ambiguous';
        dims.content.state = 'ambiguous';
        dims.content.conflicts = [{ labels: ['instrumental', vocalOk ? 'vocal' : null, speechOk ? 'speech' : null].filter(Boolean), reason: 'competing content signals' }];
        pushConflict(conflicts, 'content', ['instrumental', vocalOk ? 'vocal' : null, speechOk ? 'speech' : null].filter(Boolean), 'competing content signals; marked ambiguous');
      }
    } else if (dims.content.state === 'vocal') {
      if (vocalLvl === 'strong' && (instLvl === 'weak' || instLvl === 'none') && (speechLvl === 'weak' || speechLvl === 'none')) {
        dims.content.status = 'accepted';
        resolved_labels.push('vocal');
      } else if (vocalLvl === 'medium' && (instLvl === 'weak' || instLvl === 'none') && (speechLvl === 'weak' || speechLvl === 'none')) {
        dims.content.status = 'candidate';
      } else {
        dims.content.status = 'ambiguous';
        dims.content.state = 'ambiguous';
        dims.content.conflicts = [{ labels: ['vocal', instOk ? 'instrumental' : null, speechOk ? 'speech' : null].filter(Boolean), reason: 'competing content signals' }];
        pushConflict(conflicts, 'content', ['vocal', instOk ? 'instrumental' : null, speechOk ? 'speech' : null].filter(Boolean), 'competing content signals; marked ambiguous');
      }
    } else if (dims.content.state === 'speech') {
      if (speechLvl === 'strong' && (instLvl === 'weak' || instLvl === 'none') && (vocalLvl === 'weak' || vocalLvl === 'none')) {
        dims.content.status = 'accepted';
        resolved_labels.push('speech');
      } else if (speechLvl === 'medium' && (instLvl === 'weak' || instLvl === 'none') && (vocalLvl === 'weak' || vocalLvl === 'none')) {
        dims.content.status = 'candidate';
      } else {
        dims.content.status = 'ambiguous';
        dims.content.state = 'ambiguous';
        dims.content.conflicts = [{ labels: ['speech', instOk ? 'instrumental' : null, vocalOk ? 'vocal' : null].filter(Boolean), reason: 'competing content signals' }];
        pushConflict(conflicts, 'content', ['speech', instOk ? 'instrumental' : null, vocalOk ? 'vocal' : null].filter(Boolean), 'competing content signals; marked ambiguous');
      }
    } else if (dims.content.state === 'vocal_speech') {
      const hasStrong = vocalLvl === 'strong' || speechLvl === 'strong';
      dims.content.status = hasStrong ? 'accepted' : 'candidate';
      if (dims.content.status === 'accepted') {
        resolved_labels.push('vocal');
        resolved_labels.push('speech');
      }
    }

    if (!dims.content.agreement && dims.content.source_labels && dims.content.source_labels.length > 0) {
      const entries = dims.content.source_labels.map((k) => labels[k]).filter((e) => e && typeof e.count === 'number');
      if (entries.length === 1) {
        const s = scoreFromEntry(entries[0], totalVotes);
        dims.content.agreement = s.agreement;
        dims.content.score = s.score;
        dims.content.confidence = s.confidence;
      } else if (entries.length > 1) {
        const agreements = entries.map((e) => agreementFromCount(e.count, totalVotes));
        const confs = entries.map((e) => e.avg_confidence || 0);
        dims.content.agreement = agreements.reduce((a, b) => a + b, 0) / agreements.length;
        dims.content.confidence = confs.reduce((a, b) => a + b, 0) / confs.length;
        dims.content.score = dims.content.agreement * dims.content.confidence;
      }
    }
  }

  const calm = labels.calm;
  const aggressive = labels.aggressive;
  const punchy = labels.punchy;

  const calmLvl = evidenceLevel(calm);
  const aggressiveLvl = evidenceLevel(aggressive);
  const punchyLvl = evidenceLevel(punchy);

  if (aggressiveLvl === 'strong' && (calmLvl === 'weak' || calmLvl === 'none')) {
    const s = scoreFromEntry(aggressive, totalVotes);
    dims.articulation.states = ['aggressive'];
    dims.articulation.status = 'accepted';
    dims.articulation.score = s.score;
    dims.articulation.confidence = s.confidence;
    dims.articulation.agreement = s.agreement;
    dims.articulation.source_labels = ['aggressive'];
    resolved_labels.push('aggressive');
  } else if (calmLvl === 'strong' && (aggressiveLvl === 'weak' || aggressiveLvl === 'none')) {
    const s = scoreFromEntry(calm, totalVotes);
    dims.articulation.states = ['calm'];
    dims.articulation.status = 'accepted';
    dims.articulation.score = s.score;
    dims.articulation.confidence = s.confidence;
    dims.articulation.agreement = s.agreement;
    dims.articulation.source_labels = ['calm'];
    resolved_labels.push('calm');
  } else if (calmLvl === 'medium' && aggressiveLvl === 'medium') {
    dims.articulation.states = ['ambiguous'];
    dims.articulation.status = 'ambiguous';
    dims.articulation.source_labels = ['calm', 'aggressive'];
    dims.articulation.conflicts = [{ labels: ['calm', 'aggressive'], reason: 'both medium evidence; marked ambiguous' }];
    pushConflict(conflicts, 'articulation', ['calm', 'aggressive'], 'both medium evidence; marked ambiguous');
  } else if (aggressiveLvl === 'medium' && (calmLvl === 'weak' || calmLvl === 'none')) {
    const s = scoreFromEntry(aggressive, totalVotes);
    dims.articulation.states = ['aggressive'];
    dims.articulation.status = 'candidate';
    dims.articulation.score = s.score;
    dims.articulation.confidence = s.confidence;
    dims.articulation.agreement = s.agreement;
    dims.articulation.source_labels = ['aggressive'];
  } else if (calmLvl === 'medium' && (aggressiveLvl === 'weak' || aggressiveLvl === 'none')) {
    const s = scoreFromEntry(calm, totalVotes);
    dims.articulation.states = ['calm'];
    dims.articulation.status = 'candidate';
    dims.articulation.score = s.score;
    dims.articulation.confidence = s.confidence;
    dims.articulation.agreement = s.agreement;
    dims.articulation.source_labels = ['calm'];
  }

  if (punchyLvl === 'strong') {
    const s = scoreFromEntry(punchy, totalVotes);
    if (dims.articulation.status === 'accepted') {
      dims.articulation.states = Array.from(new Set([...(dims.articulation.states || []), 'punchy']));
      dims.articulation.source_labels = Array.from(new Set([...(dims.articulation.source_labels || []), 'punchy']));
      dims.articulation.score = Math.max(dims.articulation.score, s.score);
      dims.articulation.confidence = Math.max(dims.articulation.confidence, s.confidence);
      dims.articulation.agreement = Math.max(dims.articulation.agreement, s.agreement);
      resolved_labels.push('punchy');
    } else if (dims.articulation.status === 'candidate' || dims.articulation.status === 'unknown') {
      dims.articulation.states = ['punchy'];
      dims.articulation.status = 'candidate';
      dims.articulation.score = s.score;
      dims.articulation.confidence = s.confidence;
      dims.articulation.agreement = s.agreement;
      dims.articulation.source_labels = ['punchy'];
    }
  } else if (punchyLvl === 'medium') {
    candidate_labels.push('punchy');
  }

  for (const key of Object.keys(labels)) {
    const entry = labels[key];
    if (!entry) continue;
    if (evidenceLevel(entry) === 'weak') rejected_labels.push(key);
  }

  for (const rl of resolved_labels) {
    accepted_labels.push(rl);
  }

  if (dims.energy.status === 'candidate') candidate_labels.push(...(dims.energy.source_labels || []));
  if (dims.density.status === 'candidate') candidate_labels.push(dims.density.state);
  if (dims.brightness.status === 'candidate') candidate_labels.push(dims.brightness.state);
  if (dims.rhythm.status === 'candidate') candidate_labels.push(dims.rhythm.state);

  if (dims.content.status === 'candidate') {
    if (dims.content.state === 'vocal_speech') {
      candidate_labels.push('vocal');
      candidate_labels.push('speech');
    } else if (dims.content.state !== 'ambiguous' && dims.content.state !== 'unknown') {
      candidate_labels.push(dims.content.state);
    }
  }

  if (dims.articulation.status === 'candidate') {
    for (const s of dims.articulation.states || []) {
      if (s !== 'ambiguous') candidate_labels.push(s);
    }
  }

  const acceptedSet = new Set(accepted_labels);
  const candidateSet = new Set(candidate_labels.filter((l) => !acceptedSet.has(l)));
  const rejectedSet = new Set(rejected_labels.filter((l) => !acceptedSet.has(l) && !candidateSet.has(l)));

  const invariantFixed = enforceDimensionLabelInvariants([...acceptedSet], [...candidateSet], dims);
  const acceptedOut = [...new Set(invariantFixed.accepted)].sort();
  const candidateOut = [...new Set(invariantFixed.candidate)].filter((l) => !acceptedOut.includes(l)).sort();
  const rejectedOut = [...rejectedSet].sort();

  const resolvedOut = acceptedOut;

  return {
    song,
    accepted_labels: acceptedOut,
    candidate_labels: candidateOut,
    rejected_labels: rejectedOut,
    resolved_labels: resolvedOut,
    dimensions: dims,
    conflicts,
    debug: {
      source_normalized_labels: labels
    }
  };
}

function main() {
  const inputArg = process.argv[2];
  if (!inputArg) {
    console.log('Usage: node baseline/scripts/clean.js batch_1.json');
    process.exitCode = 1;
    return;
  }

  const baselineRoot = path.join(__dirname, '..');
  const normalizedDir = path.join(baselineRoot, 'data', 'normalized');
  const cleanedDir = path.join(baselineRoot, 'data', 'cleaned');

  const batchName = path.basename(inputArg, path.extname(inputArg));
  const m = String(batchName).match(/^batch_(\d+)$/);
  const batchNumber = m ? m[1] : batchName;

  const normalizedPath = path.join(normalizedDir, `batch_${batchNumber}_norm.json`);
  const cleanedBatchPath = path.join(cleanedDir, `batch_${batchNumber}_clean.json`);

  const normalizedBatch = readJson(normalizedPath);
  const cleanedBatch = Array.isArray(normalizedBatch) ? normalizedBatch.map(cleanOneSong) : [];

  writeJson(cleanedBatchPath, cleanedBatch);
  console.log(`[clean] wrote: ${cleanedBatchPath}`);
}

main();
