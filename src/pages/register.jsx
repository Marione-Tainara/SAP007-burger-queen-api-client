import Input from "../components/Input";
import { Button } from "../components/Button";
import Logo from "../components/Logo";
import { createUser } from "../services/api";
import Message from '../components/Message';
import { codeError } from '../services/error';
import { setToken } from "../services/token";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate("");

  const location = useLocation()
  let feedback = ''
  if (location.state) {
    feedback = location.state.feedback
  }
  console.log(name)
  console.log(email)
  console.log(password)
  console.log(role)
  function handleSubmit(e) {
    e.preventDefault();
    createUser(name, email, password, role)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        setError(codeError(response));
      })
      .then((data) => {
        setToken(data.token);
        if (data.token) {
          navigate(data.role === "hall" ? "/hall" : "/kitchen");
        }
      })
      .catch((error) => console.log(error))
  }


  return (
    <form onSubmit={createUser}>
      <Logo />
      <Input
        type="name"
        placeholder="NOME"
        value={name}
        id="name"
        name="name"
        onChange={(e) => setName(e.target.value)}
      />
      <label className="label">COZINHA</label>
      <Input
        type="radio"
        value="kitchen"
        name="role"
        id="kitchen"
        onChange={(e) => setRole(e.target.value)}
      />
      <label className="label">SALÃO</label>
      <Input
        type="radio"
        value="hall"
        name="role"
        id="hall"
        onChange={(e) => setRole(e.target.value)}
      />
      <Input
        type="email"
        placeholder="E-MAIL"
        value={email}
        id="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="SENHA"
        value={password}
        id="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button text="CADASTRAR" onClick={handleSubmit} />
      <Link to="/login" className="Hiperlink">
        Já tenho cadastro
      </Link>
      {feedback && <Message type="error" msg={feedback} />}
      {error && <Message type="error" msg={error} />}
    </form>

  );
}
export default Register;
