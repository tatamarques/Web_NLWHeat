import { useContext} from "react";
import { VscGithubInverted } from "react-icons/vsc"
import { AuthContext } from "../../contexts/auth";

import styles from './styles.module.scss';

export function LoginBox(){
  const {signInUrl} = useContext(AuthContext);


  
  return(
    <div className={styles.loginBoxWrapper}>
      <strong> Login and share your message</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24"/>
        Sign In Github
      </a>
    </div>
  )
}