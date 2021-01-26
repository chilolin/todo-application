import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { todoSlice } from 'features/todo';
import * as firebaseUtils from 'firebase/utils';

import EditFormDialog from 'containers/molecules/EditFormDialog';

const middleware = getDefaultMiddleware({ serializableCheck: false });
const store = configureStore({
  reducer: todoSlice.reducer,
  middleware,
});

jest.mock('firebase/utils');

jest.mock(
  'components/molecules/SpinnerButton',
  () => ({
    children,
    onClick,
    color,
    isLoading,
  }: {
    children: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    color: string;
    isLoading: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      color={color}
      disabled={isLoading}
      data-testid={children}
    >
      {children}
    </button>
  ),
);

describe('EditFormDialogコンポーネントのテスト', () => {
  afterEach(() => {
    cleanup();
  });

  test('レンダリングする', () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    expect(getByTestId('edit-button')).toBeInTheDocument();
    expect(queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('編集ボタンを押す', () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    expect(getByTestId('edit-button')).toBeInTheDocument();
    expect(queryByTestId('dialog')).not.toBeInTheDocument();

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    expect(getByTestId('edit-button')).toBeInTheDocument();
    expect(getByTestId('dialog')).toBeInTheDocument();
  });

  test('フォームに入力する', () => {
    const { getByTestId, getByLabelText } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    const titleInputElement = getByLabelText(/やる事/) as HTMLInputElement;
    const dateInputElement = getByLabelText(/期日/) as HTMLInputElement;

    userEvent.type(titleInputElement, 'test-task');
    userEvent.type(dateInputElement, '2021-01-26');

    expect(titleInputElement).toHaveValue('test-task');
    expect(dateInputElement).toHaveValue('2021-01-26');
  });

  test('更新ボタンを押す', async () => {
    const firebaseTaskUpdatedStub = jest
      .spyOn(firebaseUtils, 'firebaseTaskUpdated')
      .mockImplementation(() => Promise.resolve());

    const { getByTestId, getByLabelText } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    const titleInputElement = getByLabelText(/やる事/) as HTMLInputElement;
    const dateInputElement = getByLabelText(/期日/) as HTMLInputElement;
    const updateButtonElement = getByTestId('更新する') as HTMLButtonElement;
    const deleteButtonElement = getByTestId('削除する') as HTMLButtonElement;

    userEvent.click(updateButtonElement);

    expect(titleInputElement.disabled).toEqual(true);
    expect(dateInputElement.disabled).toEqual(true);
    expect(updateButtonElement.disabled).toEqual(true);
    expect(deleteButtonElement.disabled).toEqual(true);

    expect(firebaseTaskUpdatedStub).toHaveBeenCalled();

    await waitFor(() => {
      expect(titleInputElement.disabled).toEqual(false);
      expect(dateInputElement.disabled).toEqual(false);
      expect(updateButtonElement.disabled).toEqual(false);
      expect(deleteButtonElement.disabled).toEqual(false);

      expect(getByTestId('edit-button')).toBeInTheDocument();
      expect(getByTestId('dialog')).toBeInTheDocument();
    });
  });

  test('更新ボタンを押したときfirebaseがエラーを返す', async () => {
    const firebaseTaskUpdatedStub = jest
      .spyOn(firebaseUtils, 'firebaseTaskUpdated')
      .mockImplementation(() => Promise.reject());

    const { getByTestId } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    const updateButtonElement = getByTestId('更新する') as HTMLButtonElement;

    userEvent.click(updateButtonElement);

    expect(updateButtonElement.disabled).toEqual(true);

    expect(firebaseTaskUpdatedStub).toHaveBeenCalled();

    await waitFor(() => {
      expect(updateButtonElement.disabled).toEqual(false);

      expect(getByTestId('edit-button')).toBeInTheDocument();
      expect(getByTestId('dialog')).toBeInTheDocument();
    });
  });

  test('削除ボタンを押す', async () => {
    const firebaseTaskDeletedStub = jest
      .spyOn(firebaseUtils, 'firebaseTaskDeleted')
      .mockImplementation(() => Promise.resolve());

    const { getByTestId, getByLabelText } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    const titleInputElement = getByLabelText(/やる事/) as HTMLInputElement;
    const dateInputElement = getByLabelText(/期日/) as HTMLInputElement;
    const updateButtonElement = getByTestId('更新する') as HTMLButtonElement;
    const deleteButtonElement = getByTestId('削除する') as HTMLButtonElement;

    userEvent.click(deleteButtonElement);

    expect(titleInputElement.disabled).toEqual(true);
    expect(dateInputElement.disabled).toEqual(true);
    expect(updateButtonElement.disabled).toEqual(true);
    expect(deleteButtonElement.disabled).toEqual(true);

    expect(firebaseTaskDeletedStub).toHaveBeenCalled();

    await waitFor(() => {
      expect(titleInputElement.disabled).toEqual(false);
      expect(dateInputElement.disabled).toEqual(false);
      expect(updateButtonElement.disabled).toEqual(false);
      expect(deleteButtonElement.disabled).toEqual(false);

      expect(getByTestId('edit-button')).toBeInTheDocument();
      expect(getByTestId('dialog')).toBeInTheDocument();
    });
  });

  test('削除ボタンを押したときfirebaseがエラーを返す', async () => {
    const firebaseTaskDeletedStub = jest
      .spyOn(firebaseUtils, 'firebaseTaskDeleted')
      .mockImplementation(() => Promise.reject());

    const { getByTestId } = render(
      <Provider store={store}>
        <EditFormDialog id="123" />
      </Provider>,
    );

    const editButtonElement = getByTestId('edit-button');

    userEvent.click(editButtonElement);

    const deleteButtonElement = getByTestId('削除する') as HTMLButtonElement;

    userEvent.click(deleteButtonElement);

    expect(deleteButtonElement.disabled).toEqual(true);

    expect(firebaseTaskDeletedStub).toHaveBeenCalled();

    await waitFor(() => {
      expect(deleteButtonElement.disabled).toEqual(false);

      expect(getByTestId('edit-button')).toBeInTheDocument();
      expect(getByTestId('dialog')).toBeInTheDocument();
    });
  });
});
