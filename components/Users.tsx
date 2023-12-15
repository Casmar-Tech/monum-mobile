/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {resReqApi} from '../api/reqRes';
import {Text} from 'react-native';
import {ResReqList, User} from '../interfaces/reqRes';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    resReqApi
      .get<ResReqList>('/users')
      .then(resp => {
        setUsers(resp.data.data);
      })
      .catch(err => {
        console.log(err);
      });
    return () => {};
  }, []);

  return (
    <Text
      style={{
        color: 'black',
        fontSize: 20,
      }}>
      {JSON.stringify(users)}
    </Text>
  );
};
