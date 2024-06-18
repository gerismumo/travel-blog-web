"use client"

import React, { useState } from 'react'

type Month = {
    name: string;
    number: number;
  };
  
  export const months: Month[] = [
    { name: 'January', number: 1 },
    { name: 'February', number: 2 },
    { name: 'March', number: 3 },
    { name: 'April', number: 4 },
    { name: 'May', number: 5 },
    { name: 'June', number: 6 },
    { name: 'July', number: 7 },
    { name: 'August', number: 8 },
    { name: 'September', number: 9 },
    { name: 'October', number: 10 },
    { name: 'November', number: 11 },
    { name: 'December', number: 12 }
  ];
  
const page = () => {
    const[destination, setDestination] = useState<string>("");
    const[question, setQuestion] = useState<string>('');
    const[answer, setAnswer] = useState<string>('');
    const[month, setMonth] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} 
      className="flex flex-col gap-[10px] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
            Destination
          </label>
          <select name="destination" id="destination"
          className='input w-full'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">select destination</option>
            <option value="London">London</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="month">
            Month
          </label>
          <select name="month" id="month"
          className='input w-full'
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">select month</option>
            {months.map((month) => (
                <option key={month.number} value={month.name}>{month.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="question">
            Question
          </label>
          <textarea name="question" id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className='input w-full'
          >
          </textarea>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
            Answer
          </label>
          <textarea name="answer" id="answer"
          placeholder=''
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className='input w-full'
          >
          </textarea>
        </div>
        <div className="flex flex-row w-[100%]">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default page