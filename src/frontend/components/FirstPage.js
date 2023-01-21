import React, { useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'

function FirstPage(props) {
  let { loading, account, ballot, manager, candidates, isManager } = props.data
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [variant, setVariant] = useState("")
  const submit = async (e) => {
    e.preventDefault()
    let value = ""
    value = await ballot.getVoter(account)
    // console.log(value.canVote)
    if (!value.canVote) {
      setIsDisabled(true)
      setErrorMessage("You are not authorized to vote!")
      setVariant("danger")
    } else if (selectedCandidate.length == 0) {
      setIsDisabled(true)
      setErrorMessage("Select a candidate first")
      setVariant("danger")
    } else if (value.voted) {
      setVariant("danger")
      setIsDisabled(true)
      setErrorMessage("You have already voted once. You cannot vote twice")
    } else {
      await ballot.vote(selectedCandidate)
      setVariant("success")
      setErrorMessage("Your vote has been submitted")
      setIsDisabled(true);
    }
    // console.log('this is submitted')
  }
  // console.log(ballot)
  let type = 'radio'
  return (
    <div className='d-flex row' style={{ margin: 0 }}>
      <div className='mt-3 d-flex row justify-content-around'>
        {
          loading ?
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            :
            (
              <div>
                <h1 className='text-center'>Candidates</h1>
                <Form onSubmit={submit}>
                  <div className='d-flex justify-content-around col mt-5'>
                    {candidates !== undefined ? candidates.map((name, i) => {
                      return (
                        <Form.Check
                          inline
                          name="voted"
                          value={i}
                          // checked={setSelectedCandidate(i)}
                          onChange={(e) => {
                            setSelectedCandidate(e.target.value)
                          }}
                          type={type}
                          id={`inline-${type}-1`}
                          key={name}
                          label={<span style={{
                            display: 'inline-block',
                            fontSize: '2rem',
                            verticalAlign: 'middle',
                            fontWeight: '600',
                            marginTop: '-0.8rem'
                          }}>
                            {name}</span>
                          }
                        />
                      )
                    })
                      :
                      (<>
                        <h4>No Candidates</h4>
                      </>)
                    }
                  </div>
                  <div className='d-flex justify-content-around mt-5'>
                    {candidates !== undefined ? <Button type='submit' variant="primary">Vote</Button> : <></>}
                  </div>
                  <div className='d-flex justify-content-around mt-4'>
                    {isDisabled ? <Alert key={variant} variant={variant}>
                      {errorMessage}
                    </Alert> :
                      <></>
                    }
                  </div>
                </Form>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default FirstPage