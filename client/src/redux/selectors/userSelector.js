import { createSelector } from 'reselect'

const selectUserSignUp = state => state.signUp
const selectUserSignIn = state => state.signIn
const selectUserResetPassword = state => state.resetPassword

// sign-up 
export const selectUserInfo = createSelector(
  [selectUserSignUp],
  user => user.signUpInfo
)
export const selectUserInfoError = createSelector(
  [selectUserSignUp],
  user => user.error
)
export const selectSignUpLoading = createSelector(
  [selectUserSignUp],
  user => user.loading
)

// sign-in
export const makeSelectSignInInfo = createSelector(
  [selectUserSignUp],
  user => user.signInInfo
)
export const makeSelectSignInLoading = createSelector(
  [selectUserSignIn],
  user => user.loading
)
export const makeSelectSignInError = createSelector(
  [selectUserSignIn],
  user => user.error
)
export const makeSelectEmail = createSelector(
  [selectUserSignIn],
  user => user.userEmail
)
export const makeSelectPassword = createSelector(
  [selectUserSignIn],
  user => user.password
)
export const makeSelectIsAuthenticated = createSelector(
  [selectUserSignIn],
  user => user.isAuthenticated
)

// reset-password
export const makeSelectResetPasswordLoading = createSelector(
  [selectUserResetPassword],
  user => user.loading
)
export const makeSelectResetPasswordError = createSelector(
  [selectUserResetPassword],
  user => user.error
)

export const makeVerification = createSelector(
  [selectUserResetPassword],
  result => result
)
