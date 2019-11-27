import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Form from './Form';
// import fes from '../2019.json';
import Link from 'next/link';


const useStyles = makeStyles({
    list: {
        width: "67vmin",
    },
    btn: {
        backgroundColor: '#e06f84',
        color: 'white'
    }
});

export default function TemporaryDrawer( {fes} ) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && event.key !== 'Escape') {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            onKeyDown={toggleDrawer(side, false)}
        >
            <Form></Form>
            <Divider />
            <p>찾는 축제 목록</p>
            <List>
                {fes.map((fes) => (

                    <ListItem button key={fes.id}>
                        <Link href="/p/[id]" as={`/p/${JSON.stringify({
                            id: fes.id,
                            name: fes.name,
                            x: fes.x,
                            y: fes.y

                        })}`}>
                            <a>
                                <ListItemIcon>
                                    <img src={`/img/${fes.id}.jpg`}></img>
                                </ListItemIcon>
                                <ListItemText primary={fes.name} />
                            </a>
                        </Link>
                    </ListItem>

                ))}
            </List>
            <style jsx>{`
                img {
                    width: 50vmin;
                    height: 50vmin;
                }
                a {
                    text-decoration: none;
                    color: black;
                    cursor: pointer;
                    background-color: #f9f9f9;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    width: 50vmin;
                    padding: 4px 4px;
                }
                p {
                    margin: 4%;
                }
            `}</style>

        </div>
    );

    return (
        <div>
            <div className="btn">
                <Button onClick={toggleDrawer('left', true)} className={classes.btn}>Click Here!</Button>
            </div>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
            <style jsx>{`
                .btn {
                    z-index: 2;
                }
            `}</style>
        </div>
    );
}
