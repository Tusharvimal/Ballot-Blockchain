import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import ballotAddress from '../contractsData/ballot-address.json'

function ManagerAccess(props) {

    const [address, setAddress] = useState("")
    const { loading, account, ballot, manager, candidates, isManager } = props.data
    const [winnerName, setWinnerName] = useState("")

    const giveRightToVote = async () => {
        await ballot.giveRightToVote(address)
        // console.log('it passed')
    }

    const winner = async () => {
        let winner = await ballot.winnerName()
        setWinnerName(winner);
    }
    // console.log(winnerName);

    return (
        <div className='d-flex m-4 row'>
            <div className='d-flex col'>
                <InputGroup className="m-3" style={{ width: '80%' }}>
                    <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder='Enter Address of person to give him/her right to vote'
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    />
                    <InputGroup.Text id="inputGroup-sizing-default">
                        Address
                    </InputGroup.Text>
                </InputGroup>
                <Button className='m-3' onClick={giveRightToVote} variant="primary">Giving right to Vote</Button>
            </div>
            <div className='d-flex m-3'>
                <Button onClick={winner} variant="success">Election Result</Button>
            </div>
            <div className='d-flex m-3'>
                <h3>{winnerName}</h3>
            </div>
        </div>
    )
}

export default ManagerAccess