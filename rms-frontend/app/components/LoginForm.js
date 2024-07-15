// import { useState } from 'react';
// import axios from 'axios';

// const LoginForm = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/resultapp/accounts/login/', {
//         username,
//         password
//       });
//       console.log('Login successful:', response.data);
//       // Redirect or handle success as needed
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <br />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default LoginForm;


import { useState } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import { useRouter } from 'next/navigation';

import { useAuth } from '../AuthContext';


const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/resultapp/accounts/login/', {
        username,
        password
      },{withCredentials: true});
      if (response.status === 200){
        router.push('/dashboard');
      }
      login(response.data);
      console.log('Login successful:', response.data);
      // Redirect or handle success as needed
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default LoginForm;
