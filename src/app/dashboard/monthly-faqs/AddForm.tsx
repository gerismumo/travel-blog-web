"use client"

import { IDestinationList, IDestionationMonthFaq, IFaq, ISuccessFormProp } from '@/(types)/type';
import Loader from '@/app/components/Loader';
import { months } from '@/lib/months';
import { getDestinations } from '@/utils/(apis)/destinationApi';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const AddForm:React.FC<ISuccessFormProp>  = ({onSuccess}) => {
    const[destination, setDestination] = useState<string>("");
    const[question, setQuestion] = useState<string>('');
    const[answer, setAnswer] = useState<string>('');
    const[month, setMonth] = useState<string>('');
    const [destinations, setDestinations] = useState<IDestinationList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [faqs, setFaqs] = useState<IFaq[]>([{question: "", answer: ""}]);

    //add faqs object
    const handleAddFaq = () => {
      setFaqs([...faqs, {question: "", answer: ""}]);
    }
    //delete faq object
    const handleDeleteFaq = (index: number) => {
      setFaqs(faqs.filter((_, i) => i!== index));
    }

    //handleChangeOfaq

    const handleChangeOfaq = (index: number, key: keyof IFaq, value: string) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index][key] = value;
        setFaqs(updatedFaqs);
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getDestinations();
            setDestinations(data);
          } catch (error : any) {
            toast.error(error.message);
          }finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [setDestinations]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(destination === ""|| month === "" || faqs.length === 0) {
            return toast.error("all fields are required")
        }

        const data: IDestionationMonthFaq = {
            destination: destination,
            month: month,
            faqs: faqs
        }

        try{
            const response = await axios.post('/api/faq/month', data);
            if(response.data.success) {
                onSuccess();
                toast.success(response.data.message);
                setMonth('');
                setDestination('');
                setFaqs([{question: "", answer: ""}]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error : any) {
            toast.error(error.message);
        }
    }

    //loader
    if(loading) {
      return(
        <Loader/>
      )
    }

  return (
    <div className="w-[100%]">
      <form onSubmit={handleSubmit} 
      className="flex flex-col gap-[10px] bg-white shadow-md rounded p-[10px] sm:p-[30px]">
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm font-bold " htmlFor="destination">
            Destination <span className="text-red-500">*</span>
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
            Month <span className="text-red-500">*</span>
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
        <div className="flex flex-row items-end">
          <button
          type='button'
          onClick={handleAddFaq}
          className="bg-lightDark hover:dark text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >Add Faq</button>
        </div>
        <div className="flex flex-col gap-[10px]">
          {faqs.map((f, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex flex-row justify-end">
                <button
                type='button'
                 className='bg-red-400 px-[15px] py-[5px] rounded-[4px] text-white'
                onClick={() => handleDeleteFaq(index)}
                >
                  Remove
              </button>
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="question">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea name="question" id="question"
                value={f.question}
                onChange={(e) => handleChangeOfaq(index, "question", e.target.value)}
                className='input w-full'
                >
                </textarea>
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold " htmlFor="date">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea name="answer" id="answer"
                placeholder=''
                value={f.answer}
                onChange={(e) => handleChangeOfaq(index, "answer", e.target.value)}
                className='input w-full'
                >
                </textarea>
              </div>
            </div>
          ))}
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

export default AddForm