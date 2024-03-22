import { useState, useEffect } from 'react'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import './App.css'
import Die from './Die' 

export default function App() {
    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)
    const [rollCount, setRollCount] = useState(0)
    const { width, hieght } = useWindowSize()

    useEffect(() => {
      const allHeldedDice = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      if (allHeldedDice && allSameValue) {
        setTenzies(true)
      }
    }, [dice])

    /* Generating new dice, which weren't holding */

    function generateNewDie() {
        return {value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    /* Starting game with all new dices */

    function allNewDice() {
        const diceArr = []
        for(let i =0; i < 10; i++){
            diceArr.push(generateNewDie())
        } return  diceArr        
    }

   
     /* rendering Die component*/

    const diceNum = dice.map (num => 
        <Die key={num.id} value={num.value} isHeld={num.isHeld} holdDice = {() => holdDice(num.id)} />
        )


    function reRollDice() {
        if(!tenzies) {
            setRollCount(diceRoll => {
                return diceRoll+1
            })
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
    }   else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
    }
        }
           
        /* Hold selected dices */

    function holdDice(id) {
            setDice(oldDice => oldDice.map(die => {
                return die.id === id ?
                    {...die, isHeld: !die.isHeld} :
                    die
            }))
    }
    

    return ( 
     <main className='main'>
     {rollCount ? <p className='dice-count'>Dice rolls: <span>{rollCount}</span></p> : ''}
     { tenzies && <Confetti width={width} height={hieght} />}
     <h1 className="title">Tenzies</h1>
        <p className="instructions">{tenzies ? "You Won!" : `Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.`}
        </p>
        <div className='container'>
            {diceNum}
        </div>
        <button 
            className='rollBtn' 
            onClick={reRollDice}>
            { tenzies ?  'New game' :  "Roll"}
        </button>

     </main>
    )
}


