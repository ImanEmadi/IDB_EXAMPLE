//@ts-ignore
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//@ts-ignore
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
//@ts-ignore
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
const dbVersion = 3;
document.getElementById('btn').addEventListener('click', function (e) {
    e.preventDefault();
    const _IDBDatabaseRequest: IDBOpenDBRequest = window.indexedDB.open('AppDB', dbVersion);

    _IDBDatabaseRequest.onerror = err => console.error(err);
    _IDBDatabaseRequest.onsuccess = ev => {
        console.log('IDB opened successful');
        const _IDBDatabase = _IDBDatabaseRequest.result;
        const transaction = _IDBDatabase.transaction('objStore', 'readwrite'); // Array.from(_IDBDatabase.objectStoreNames)
        transaction.oncomplete = e => {
            console.log('transaction complete', e);
        }
        var store: IDBObjectStore;
        try {
            store = transaction.objectStore('objStore');
        } catch (error) {
            console.error(error);
        }

        if (typeof store === 'undefined') return console.error('store is undefined');
        const buffer = new Uint8Array(500_000); // 500kb
        const myFile = new File([buffer], 'pseudoFile', { type: 'text/plain' });
        const fileAddRequest = store.put(myFile, 'f1');
        fileAddRequest.onerror = err => console.error(err);

        fileAddRequest.onsuccess = ev => {
            console.log('file saved successfully');
            const f = store.get('f1');
            f.onsuccess = e => {
                console.log('found the file');
                console.log(f.result);
            }
        };
    }
    _IDBDatabaseRequest.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        const db = (ev.target as IDBOpenDBRequest).result;
        if (ev.oldVersion < dbVersion) db.deleteObjectStore('objStore');
        db.createObjectStore("objStore", { autoIncrement: false });
    }
}); // end onClick
