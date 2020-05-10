import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import firebase from './Firebase';

const FIND_OR_CREATE = gql`
  mutation findOrCreate($input: CreateUserInput!) {
    user: findOrCreate(input: $input) {
      id
      phone
      email
      lastname
      firstname
      profilePicture
    }
  }
`;

const USER = gql`
  query {
    user {
      id
      phone
    }
  }
`;

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const history = useHistory();
  const [findOrCreate] = useMutation(FIND_OR_CREATE);
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [queryUser] = useLazyQuery(USER, {
    onCompleted(data) {
      setCurrentUser(data.user);
      setPending(false);
    },
  });

  useEffect(() => {
    (async function () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          setCurrentUser(null);
          setPending(false);
        } else {
          queryUser();
        }
      });
      let redirectResult = await firebase.auth().getRedirectResult();
      if (redirectResult.user) {
        setPending(true);
        const {
          given_name,
          family_name,
          picture,
        } = redirectResult.additionalUserInfo.profile;
        let { data } = await findOrCreate({
          variables: {
            input: {
              firstname: given_name,
              lastname: family_name,
              profilePicture: picture,
            },
          },
        });
        setCurrentUser(data.user);
        history.push('/home');
        setPending(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  if (pending) {
    return 'Loading ...';
  }
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
