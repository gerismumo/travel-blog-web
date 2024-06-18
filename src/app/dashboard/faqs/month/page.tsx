"use client"

import { IDestinationList, IDestionationMonthFaq } from '@/(types)/type';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const page = () => {
    const[destination, setDestination] = useState<string>("");
    const[question, setQuestion] = useState<string>('');
    const[answer, setAnswer] = useState<string>('');
    const[month, setMonth] = useState<string>('');
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error : any) {
            toast.error(error.message);
          }
        };
    
        fetchData();
      }, [setDestinations]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(destination === ""|| month === "" || question === "" || answer === "") {
            return toast.error("all fields are required")
        }

        const data: IDestionationMonthFaq = {
            destinationId: destination,
            month: month,
            question: question,
            answer: answer
        }

        try{
            const response = await axios.post('/api/faq/month', data);
            if(response.data.success) {
                toast.success(response.data.message);
                setMonth('');
                setDestination('');
                setQuestion('');
                setAnswer('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error : any) {
            toast.error(error.message);
        }
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
            {destinations.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
            ))}
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
                <option key={month.id} value={month.id}>{month.name}</option>
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
            className="bg-lightDark hover:bg-dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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