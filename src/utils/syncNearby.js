import { doc, updateDoc } from 'firebase/firestore';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

// Build a name → Firestore doc ID map from a loaded neighborhoods array.
export function buildNameToId(neighborhoods) {
  return Object.fromEntries(neighborhoods.map(n => [n.name, n.id]));
}

// Mirror a nearby change onto every affected neighbor document.
// When neighborhood A adds B to its nearby list, B's nearby list gets A added too,
// and vice versa for removals. Neighbors not yet in Firestore are silently skipped.
export async function syncNearbyRelationships(currentName, oldNearby, newNearby, nameToId) {
  const added   = newNearby.filter(n => !oldNearby.includes(n));
  const removed = oldNearby.filter(n => !newNearby.includes(n));

  await Promise.all([
    ...added
      .filter(n => nameToId[n])
      .map(n => updateDoc(doc(db, 'neighborhoods', nameToId[n]), { nearby: arrayUnion(currentName) })),
    ...removed
      .filter(n => nameToId[n])
      .map(n => updateDoc(doc(db, 'neighborhoods', nameToId[n]), { nearby: arrayRemove(currentName) })),
  ]);
}
