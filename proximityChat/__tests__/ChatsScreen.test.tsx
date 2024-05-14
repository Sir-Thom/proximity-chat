import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatsScreen from '../Screens/ChatsScreen';
import { firebase } from "../firebaseconfig";

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('../firebaseconfig', () => ({
  firebase: {
    auth: jest.fn().mockReturnValue({
      currentUser: { uid: 'testUid' }
    }),
    database: jest.fn().mockReturnValue({
      ref: jest.fn().mockReturnValue({
        remove: jest.fn().mockResolvedValue('Conversation supprimée')
      })
    })
  }
}));

describe('ChatsScreen', () => {
  describe('lorsque le bouton de suppression est pressé', () => {
    it('appelle la fonction deleteConversation', async () => {
      const { getByText, getByTestId } = render(<ChatsScreen />);
      
      const deleteButton = getByText('Supprimer');
      
      fireEvent.press(deleteButton);
      
      expect(firebase.database().ref().remove).toHaveBeenCalled();
    });
  });
});
