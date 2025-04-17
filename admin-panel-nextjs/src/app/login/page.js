import Login from "../components/Login/Login"
import styles from "./page.module.css"
export default function LoginPage() {
    return (
        <div className={styles.formsContainer}>
            <Login></Login>
        </div>
    )
}