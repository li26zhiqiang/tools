import React from 'react';

import './index.less';

export default (props) => {
    const { title, className = '', children } = props;

    return (
        <section className={`page-card-container ${className}`}>
            {title && (
                <div className="header">
                    <div>{title}</div>
                </div>
            )}

            <div className="content">{children}</div>
        </section>
    );
};
