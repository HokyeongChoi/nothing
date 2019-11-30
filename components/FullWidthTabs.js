import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Restaurant from './Restaurant';
import dynamic from 'next/dynamic';
import TemporaryDrawer from './TemporaryDrawer';

const LeafMap = dynamic(
    () => import('./LeafMap'),
    {
        ssr: false
    }
)

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {children}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'primary',
        width: '100vw',
        flexGrow: 1,
    },
    panel: {
        position: 'fixed',
        top: '25vmin',
        left: '2.5vw',
        overflow: 'hidden'
    },
    scrollContainer: {
        position: 'relative',
        marginTop: '1vmin',
        marginLeft: '2.5vmin',
        overflow: 'auto',
        height: '40vh',
        padding: '0',
    },
    scrollContainerMain: {
        position: 'relative',
        marginTop: '0vmin',
        marginLeft: '0vmin',
        overflow: 'visible',
        height: '70vh',
        padding: '0',
    },
    scroll: {
        position: 'absolute',
        margin: '0',
        padding: '0',
        width: '90vw',
    },
    ul: {
        margin: '0',
        padding: '0',
    },
    main: {

    }
}));

export default function FullWidthTabs({ fe, res, fes }) {
    const [orientation, setOrientation] = useState(1);

    const rotateHandler = () => {
        setOrientation(window.innerWidth < window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', rotateHandler);
    }, [])

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar>
                <TemporaryDrawer fes={fes}></TemporaryDrawer>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs"
                >
                    <Tab label="축제정보" {...a11yProps(0)} />
                    <Tab label="지도" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                className={classes.panel}
            >
                <TabPanel value={value} index={0} dir={theme.direction} >
                    <div className={classes.scrollContainerMain}>
                        <div className={classes.main}>
                            <div>
                                <img className="info-img" src={`/img/${fe.id}.jpg`}></img>
                            </div>
                            <p className="info-name">{fe.name}</p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <LeafMap fes={fe} res={res} key={value === 1} invalidate={value === 1}></LeafMap>
                    <div className={classes.scrollContainer}>
                        <div className={classes.scroll}>
                            <ul className={classes.ul}>
                                {res.map(res =>
                                    (<a href={res.place_url}>
                                        <li className="info-li" key={res.id}>
                                            <Restaurant res={res}></Restaurant>
                                        </li>
                                    </a>
                                    )
                                )}
                            </ul>
                            <footer>
                                <div>
                                    Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from
                                <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                                </div>
                            </footer>
                        </div>
                    </div>
                </TabPanel>
            </SwipeableViews>
            <style jsx>{`
                body {
                    padding: 0;
                    margin: 0;
                }
                html, body {
                    height: 100vh;
                    width: 100vw;
                }
                .info-img {
                display: block;
                width: 90vw;
                border: solid;
                margin: 2vw;
                position: relative;
                }
                .info-name {
                margin-left: 3vw;
                margin-bottom: 5vw;
                position: relative;
                }
                .info-li {
                list-style-type: none;
                //   background-color: #ffb190;
                font-family: sans-serif;
                color: rgba(0, 0, 0, 0.87);
                margin: auto 0;
                border-bottom: 1px solid #fbe4d4;
                }
                .info-li:hover {
                    background-color: rgba(245, 132, 84, 0.5);
                }
                ul a {
                    text-decoration: none;
                    -webkit-text-decoration: none;
                    color: black;
                }
                ul {
                    display: ${orientation ? '' : 'none'};
                }
            `}</style>
        </div>
    );
}
