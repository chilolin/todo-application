import React, { FC } from 'react';

import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';

import UpdateFormDialog from 'containers/molecules/UpdateFormDialog';

type Props = {
  isLoading: boolean;
  id: string;
  title: string;
  deadline?: string;
  isDone?: boolean;
  handleTaskDoneClick: () => void;
  handleTaskTodoClick: () => void;
};

const TaskItem: FC<Props> = ({
  isLoading = false,
  id = '',
  title = '',
  deadline = undefined,
  isDone = false,
  handleTaskDoneClick = () => undefined,
  handleTaskTodoClick = () => undefined,
}) => (
  <>
    {isLoading ? (
      <LinearProgress />
    ) : (
      <ItemWrapper>
        <p>やる事：{title}</p>
        <p>期日：{deadline}</p>
        {isDone ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<FastRewindIcon />}
            onClick={handleTaskTodoClick}
          >
            TODO
          </Button>
        ) : (
          <ButtonWrapper>
            <UpdateFormDialog id={id} />
            <Button
              variant="contained"
              color="primary"
              endIcon={<FastForwardIcon />}
              onClick={handleTaskDoneClick}
            >
              DONE
            </Button>
          </ButtonWrapper>
        )}
      </ItemWrapper>
    )}
  </>
);

const ItemWrapper = styled.li`
  padding-bottom: 5px;
  margin: 0 10px 10px 10px;
  border-bottom: 1px solid lightgray;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default TaskItem;
