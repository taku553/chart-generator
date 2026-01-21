import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'
import { PasswordResetModal } from './PasswordResetModal'

export function AuthModal({ open, onOpenChange }) {
  const { signUp, signIn, signInWithGoogle, error } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [showResetModal, setShowResetModal] = useState(false)

  // ログインフォーム
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // サインアップフォーム
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLocalError(null)

    try {
      await signIn(loginEmail, loginPassword)
      onOpenChange(false)
      // フォームリセット
      setLoginEmail('')
      setLoginPassword('')
    } catch (err) {
      setLocalError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLocalError(null)

    // パスワード確認
    if (signupPassword !== confirmPassword) {
      setLocalError(t('auth.error.passwordMismatch'))
      setLoading(false)
      return
    }

    // パスワード強度チェック
    const { isValid, errors } = validatePassword(signupPassword)
    if (!isValid) {
      setLocalError(t('auth.error.passwordInvalid', { errors: errors.join(', ') }))
      setLoading(false)
      return
    }

    try {
      await signUp(signupEmail, signupPassword, signupName)
      onOpenChange(false)
      // フォームリセット
      setSignupEmail('')
      setSignupPassword('')
      setSignupName('')
      setConfirmPassword('')
    } catch (err) {
      setLocalError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setLocalError(null)

    try {
      await signInWithGoogle()
      onOpenChange(false)
    } catch (err) {
      setLocalError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return t('auth.error.emailInUse')
      case 'auth/invalid-email':
        return t('auth.error.invalidEmail')
      case 'auth/user-not-found':
        return t('auth.error.userNotFound')
      case 'auth/wrong-password':
        return t('auth.error.wrongPassword')
      case 'auth/weak-password':
        return t('auth.error.weakPassword')
      case 'auth/popup-closed-by-user':
        return t('auth.error.popupClosed')
      case 'auth/requires-recent-login':
        return t('auth.error.recentLoginRequired')
      case 'auth/invalid-credential':
        return t('auth.error.invalidCredential')
      case 'auth/user-disabled':
        return t('auth.error.userDisabled')
      case 'auth/too-many-requests':
        return t('auth.error.tooManyRequests')
      default:
        return t('auth.error.default')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.title')}</DialogTitle>
          <DialogDescription>
            {t('auth.description')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.loginTab')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signupTab')}</TabsTrigger>
          </TabsList>

          {/* エラー表示 */}
          {(localError || error) && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{localError || error}</AlertDescription>
            </Alert>
          )}

          {/* ログインタブ */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth.loggingIn') : t('auth.loginButton')}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('auth.googleLogin')}
              </Button>
            </form>
          </TabsContent>

          {/* サインアップタブ */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t('auth.name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder')}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('auth.passwordRequirements')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('auth.passwordConfirm')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder={t('auth.passwordConfirmPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth.registering') : t('auth.signupButton')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('auth.googleSignup')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <PasswordResetModal 
        open={showResetModal} 
        onOpenChange={setShowResetModal}
      />
    </Dialog>
  )
}
