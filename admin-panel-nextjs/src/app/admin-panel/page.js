'use client'
import { useEffect, useState } from "react";
import MainContent from "../components/MainContent/MainContent"
import AdminNav from "../components/Navigation/Navigation"
import styles from "./page.module.css"

export default function AdminPanel() {
    const [selectedRoute, setSelectedRoute] = useState({});

    const updateSelectedRoute = (data) => {
        if (Object.keys(data).length !== 0) {
            setSelectedRoute(data);
        } else {
            setSelectedRoute({});
        }
    }

    return (
        <div className={styles.adminLayout}>
            <AdminNav  updateSelectedRoute={updateSelectedRoute} selectedRoute={selectedRoute}/>
            <MainContent updateSelectedRoute={updateSelectedRoute} selectedRoute={selectedRoute}/>
        </div>
    )
}