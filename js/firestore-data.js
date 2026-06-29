async function fsGetUserData(uid) {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function fsGetWatchlist(uid) {
  const doc = await db.collection("users").doc(uid).get();
  const data = doc.data() || {};
  return Array.isArray(data.watchlist)
    ? data.watchlist.map((item) => (typeof item === "string" ? item : item.symbol)).filter(Boolean)
    : [];
}

async function fsIsWatchlisted(uid, symbol) {
  const list = await fsGetWatchlist(uid);
  return list.includes(symbol);
}

async function fsAddToWatchlist(uid, symbol) {
  await db.collection("users").doc(uid).update({
    watchlist: firebase.firestore.FieldValue.arrayUnion(symbol)
  });
}

async function fsRemoveFromWatchlist(uid, symbol) {
  await db.collection("users").doc(uid).update({
    watchlist: firebase.firestore.FieldValue.arrayRemove(symbol)
  });
}

async function fsGetHoldings(uid) {
  const snapshot = await db.collection("users").doc(uid).collection("portfolio").get();
  return snapshot.docs.map((doc) => doc.data());
}

async function fsSaveHolding(uid, holding) {
  await db.collection("users").doc(uid).collection("portfolio").doc(holding.symbol).set({
    symbol: holding.symbol,
    quantity: holding.quantity,
    averageBuyPrice: holding.averageBuyPrice
  });
}

async function fsDeleteHolding(uid, symbol) {
  await db.collection("users").doc(uid).collection("portfolio").doc(symbol).delete();
}

async function fsSaveTransaction(uid, tx) {
  await db.collection("users").doc(uid).collection("transactions").add({
    type: tx.type,
    symbol: tx.symbol,
    companyName: tx.companyName,
    quantity: tx.quantity,
    price: tx.price,
    fee: tx.fee,
    totalAmount: tx.totalAmount,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function fsGetTransactions(uid) {
  const snapshot = await db.collection("users").doc(uid).collection("transactions").orderBy("createdAt").get();
  return snapshot.docs.map((doc) => doc.data());
}

async function fsUpdateCashBalance(uid, cashBalance) {
  await db.collection("users").doc(uid).update({ cashBalance: cashBalance });
}