import React, { FC, useState } from 'react';
import CreateForm from 'components/organisms/CreateForm';

const EnhancedCreateForm: FC = () => {
  const [createTask, setCreateTask] = useState<{
    title: string;
    deadline: string;
  }>({
    title: '',
    deadline: '',
  });

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
  };

  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e,
  ) => {
    e.preventDefault();
    const { name, value } = e.target;

    console.log(name);
    console.log(value);

    setCreateTask({ ...createTask, [name]: value });
  };

  return (
    <CreateForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      title={createTask.title}
      deadline={createTask.deadline}
    />
  );
};

export default EnhancedCreateForm;
