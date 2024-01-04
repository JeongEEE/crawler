import {FirebaseApp, getApp, initializeApp} from 'firebase/app';
import {addDoc, collection, Firestore, getDocs, getFirestore, query, where} from '@firebase/firestore';
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDERID,
  appId: process.env.APP_ID,
};

let app: FirebaseApp
try {
  app = getApp('app')
} catch(e) {
  app = initializeApp(firebaseConfig, 'app');
}

export const db = getFirestore(app)

export class Database {
  constructor(db: Firestore) {
    this.db = db
  }
  private readonly db: Firestore

  async addData<T extends object>(collections: string, createData: T) {
    return addDoc(collection(this.db, collections), createData)
  }

  async getData(collections: string, key: string, value: string) {
    const querySnapshot = await getDocs(query(collection(db, collections), where(key, '==', value)))

    let result: any = []
    querySnapshot.forEach((doc) => {
      result.push(doc.data())
    })

    return result
  }
}