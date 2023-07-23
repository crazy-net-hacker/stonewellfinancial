import React, { useEffect, useState } from 'react'


export default () => {

    const [fetchSuccess, setFetchSuccess] = useState(false)

    useEffect(() => {
        window.addEventListener('load', () => {
            setFetchSuccess(true)
        })
    }, [])

    const classNamess = fetchSuccess ? 'd-none' : ''

    return (
        <div id="preloader" className={`${classNamess}`}>
            <div className="loader-cubes">
                <div className="loader-cube1 loader-cube"></div>
                <div className="loader-cube2 loader-cube"></div>
                <div className="loader-cube4 loader-cube"></div>
                <div className="loader-cube3 loader-cube"></div>
            </div>
        </div>
    )
}