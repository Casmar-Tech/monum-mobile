import {gql} from '@apollo/client';

export const VERIFY_TOKEN_QUERY = gql`
  query VerifyToken {
    verifyToken
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      id
      email
      username
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      id
      email
      username
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
    }
  }
`;

export const LOGIN_GOOGLE_USER = gql`
  mutation LoginGoogleUser($loginGoogleInput: LoginGoogleInput!) {
    loginGoogleUser(loginGoogleInput: $loginGoogleInput) {
      id
      email
      username
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query User($userId: String!) {
    user(id: $userId) {
      id
      email
      username
      isTemporalPassword
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      username
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;
