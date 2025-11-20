import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ユーザー情報をFirestoreに保存
  const saveUserToFirestore = async (firebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // 新規ユーザーの場合のみ保存
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || null,
        photoURL: firebaseUser.photoURL || null,
        plan: 'free', // デフォルトは無料プラン
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }

  // メールアドレス・パスワードでサインアップ
  const signUp = async (email, password, displayName = null) => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Firestoreに保存
      await saveUserToFirestore({
        ...result.user,
        displayName,
      })
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // メールアドレス・パスワードでログイン
  const signIn = async (email, password) => {
    try {
      setError(null)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Googleでログイン
  const signInWithGoogle = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Firestoreに保存
      await saveUserToFirestore(result.user)
      
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // ログアウト
  const logOut = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestoreからユーザー情報を取得
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)
        
        setUser({
          ...firebaseUser,
          ...(userSnap.exists() ? userSnap.data() : {}),
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
