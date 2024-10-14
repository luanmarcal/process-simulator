import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [logged, setLogged] = useState(false);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const stopedTask = tasksRef.current.find(task => task.status === 'running');
  
      if (stopedTask) {
        const randomBoolean = Math.random() < 0.5;
        const updatedTask = { ...stopedTask, status: randomBoolean ? 'waiting' : 'ready' };
  
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === stopedTask.id ? updatedTask : task))
        );
      }
  
      const readyTasks = tasksRef.current.filter(task => task.status === 'ready');
      const selectedTask = readyTasks.length > 0
        ? readyTasks[Math.floor(Math.random() * readyTasks.length)]
        : null;
  
      if (selectedTask) {
        const updatedTask = { ...selectedTask, status: 'running' };
  
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === selectedTask.id ? updatedTask : task))
        );
      }

      const waitingTasks = tasksRef.current.filter(task => task.status === 'waiting');
      if (waitingTasks.length > 0) {
        const updatedTasks = waitingTasks.map(task => {
          const randomBoolean = Math.random() < 0.5;
          return { ...task, status: randomBoolean ? 'ready' : 'waiting' };
        });
      
        setTasks(prevTasks =>
          prevTasks.map(task =>
            updatedTasks.find(updatedTask => updatedTask.id === task.id) || task
          )
        );
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);

  const createTask = () => {
    setTasks(prevTasks => {
      const newTask = {
        id: Math.random(),
        title: `Task - ${prevTasks.length + 1}`,
        user: "admin",
        priority: 1,
        cpu_usage: Math.random() * 2,
        memory_usage: Math.random() * 2,
        status: "ready",
      };

      console.log(newTask);
      return [...prevTasks, newTask];
    });
  };


  const login = (user, password) => {
    if(user === 'admin' && password === 'admin') {
      setLogged(true);
    } else {
      alert('Usuário ou senha inválidos');
    }
  }


  // if(!logged) {
  //   return (
  //     <div className="App-login">
  //       <div className="login-container">
  //         <h1>Login</h1>
  //         <input type="text" placeholder="Usuário" id="user" />
  //         <input type="password" placeholder="Senha" id="password" />
  //         <button
  //           className="login-btn"
  //           onClick={() => login(document.getElementById('user').value, document.getElementById('password').value)}>
  //           Entrar
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <div className="primary">
        <button className="create-task-btn" onClick={createTask}>Criar Tarefa</button>
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Usuário</th>
                <th>Prioridade</th>
                <th>Uso de CPU</th>
                <th>Uso de Memória</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.user}</td>
                  <td>{task.priority}</td>
                  <td>{task.cpu_usage.toFixed(2)}%</td>
                  <td>{task.memory_usage.toFixed(2)}%</td>
                  <td className={task.status === 'running' ? 'status-running' : task.status === 'ready' ? 'status-ready' : 'status-waiting'}>
                    {task.status}
                  </td>
                  <td>
                  <button className="task-btn-remove" onClick={() => setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id))}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;