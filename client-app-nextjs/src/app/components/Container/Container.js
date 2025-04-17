import styles from './Container.module.css';
import pool from '../../../lib/db';
import { componentMap } from '../../utils/componentMapper';

export default async function Container({ container, currentLanguage }) {
    const [components] = await pool.query(
        'SELECT * FROM components WHERE container_id = ?', 
        [container.id]
    );

    const isOnlyEmpty = components.every(comp => comp.type === "Empty");

    const layoutClass = components.length === 1 ? 'one' : components.length === 2 ? 'two' : 'three';

    return (
        <div className={`${styles.container} ${styles[layoutClass]} ${isOnlyEmpty ? styles.emptyContainer : ''}` + 
            (container.order_id % 2 !== 0 ? `${styles.decorate_odd}` : `${styles.decorate_even}`)}>
            {components.map((component) => {
                const Component = componentMap[component.type];
                if (!Component) return null;

                return (
                    <Component
                        key={component.id}
                        {...component}
                        currentLanguage={currentLanguage}
                    />
                );
            })}
        </div>
    );
}
