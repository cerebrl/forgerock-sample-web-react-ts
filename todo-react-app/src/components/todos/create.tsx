/*
 * forgerock-sample-web-react
 *
 * create-todo.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useContext, useRef, useState } from 'react';

import apiRequest from '../../utilities/request';
import { AppContext } from '../../global-state';

interface Todo {
  _id: string;
  completed: boolean;
  title: string;
}

/**
 * @function CreateTodo - React component for displaying the input and button pair for todo creation
 * @param {Object} props - React props object
 * @param {Function} props.addTodo - The function that adds the todo to the local collection
 * @returns {Object} - React component object
 */
export default function CreateTodo({
  addTodo,
}: {
  addTodo: (todo: Todo) => void;
}) {
  const [state] = useContext(AppContext);

  const [creatingTodo, setCreatingTodo] = useState(false);
  const textInput = useRef<HTMLInputElement | null>(null);

  async function createTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCreatingTodo(true);

    const target = event.target as HTMLFormElement;
    const title = (target.elements[0] as HTMLInputElement).value;
    const newTodo = await apiRequest('todos', 'POST', { title });

    addTodo(newTodo);
    setCreatingTodo(false);
    (textInput.current as HTMLInputElement).value = '';
  }

  return (
    <form
      className={`p-3 d-flex ${state.theme.textClass}`}
      action="https://api.example.com:8443/todos"
      method="POST"
      onSubmit={createTodo}
    >
      <div className="cstm_todos-input cstm_form-floating form-floating flex-grow-1">
        <input
          id="newTodo"
          type="text"
          className={`cstm_form-control form-control bg-transparent ${state.theme.textClass} ${state.theme.borderClass}`}
          placeholder="What needs doing?"
          required={true}
          ref={textInput}
        />
        <label htmlFor="newTodo">What needs doing?</label>
      </div>
      <button className="btn btn-primary ms-2" type="submit">
        {creatingTodo ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          'Create'
        )}
      </button>
    </form>
  );
}
