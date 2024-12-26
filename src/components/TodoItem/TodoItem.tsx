import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onToggleStatus: (v: Todo) => void;
  handleDeleteTodo: (v: number) => void;
  isLoading: boolean;
  onRenamingTodo: (v: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: todoItem, // змінив ім'я параметра
  onToggleStatus,
  handleDeleteTodo,
  isLoading,
  onRenamingTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [renamedTodo, setRenamedTodo] = useState(todoItem.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleRenamingTodo = (
    event: // eslint-disable-next-line
    React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    if ('key' in event && event.key === 'Escape') {
      setIsEditing(false);
      setRenamedTodo(todoItem.title);

      return;
    }

    if ('key' in event && event.key !== 'Enter') {
      return;
    }

    const trimmedTitle = renamedTodo.trim();

    if (trimmedTitle === todoItem.title) {
      setIsEditing(false); // Залишити закритим, якщо нічого не змінилося

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todoItem.id);

      return;
    }

    // Викликаємо onRenamingTodo без .catch(), якщо це не асинхронна функція
    onRenamingTodo({
      ...todoItem,
      title: trimmedTitle,
    });

    // Якщо редагування успішне, закриваємо форму
    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoItem.completed && !isEditing,
      })}
      key={todoItem.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoItem.completed}
          aria-label="Mark as completed"
          onChange={() => onToggleStatus(todoItem)}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          value={renamedTodo}
          onChange={e => setRenamedTodo(e.target.value)}
          onBlur={handleRenamingTodo}
          onKeyUp={handleRenamingTodo}
          autoFocus
          data-cy="TodoTitleField"
          className="todo__title todo__title--editing"
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todoItem.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todoItem.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      {/* Overlay for loader during status change */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
