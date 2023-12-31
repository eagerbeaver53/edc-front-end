import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { GetStartupsUserEmail } from '../../../Api/Post'
import { useEffect } from 'react'
import { eventAddSchema } from '../../../validation/formSchema'
import '../styles/adminAddForm.scss'
import { useFormik } from 'formik'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

const initialValues = {
  title: '',
  dateTime: '',
  description: '',
}

const EventAddForm = ({ submitEventData, array }) => {
  const { state } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [membersData, setMembersData] = useState(null)
  const [membersError, setMembersError] = useState(null)
  const token = state.token
  const { data: Data } = GetStartupsUserEmail(token)
  const data = Data?.data?.data

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues,
    validationSchema: eventAddSchema,
    onSubmit: async (values) => {
      if (membersData.length !== 0) {
        setMembersError(null)
        setIsLoading(true)
        const body = {
          title: values.title,
          description: values.description,
          type: 'event',
          dateAndTime: values.dateTime,
          members: membersData,
        }
        //POST REQUEST
        try {
          const res = await submitEventData(body)
          resetForm()
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
        }
      } else {
        setMembersError('Atleast choose one member')
      }
    },
  })

  const handleMembersData = (values) => {
    const selectedMembers = data?.filter((email) => values.includes(email))
    setMembersData(selectedMembers)
  }

  return (
    <div className="  w-full">
      <form onSubmit={handleSubmit} className="overflow-hidden ">
        <h1 className="w-full text-2xl text-center font-light">Add New Event</h1>
        <div className="grid cols-span-12 my-5  gap-3 w-full max-w-5xl">
          <div className="input__container  w-full col-span-6">
            <label htmlFor="firstName">Title</label>
            <input
              className="border border-gray-400 w-full"
              type="text"
              name="title"
              id="title"
              placeholder="Enter Title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title && touched.title ? <p className="input-block__error">{errors.title}</p> : null}
          </div>
          <div className="input__container w-full  col-span-6">
            <label htmlFor="dateTime">Date and Time</label>
            <input
              className="border border-gray-400 w-full"
              type="datetime-local"
              name="dateTime"
              id="dateTime"
              value={values.dateTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.dateTime && touched.dateTime ? <p className="input-block__error">{errors.dateTime}</p> : null}
          </div>
          <div className="input__container w-full  col-span-12">
            <label htmlFor="description">Event Details</label>
            <textarea
              className="border rounded-md bg-[#f3ebeb] w-full  border-gray-400"
              type="tel"
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && touched.description ? (
              <p className="input-block__error">{errors.description}</p>
            ) : null}
          </div>
          <div className="input__container w-full  col-span-12">
            <label htmlFor="tags-filled">Add Members</label>
            <Autocomplete
              multiple
              id="tags-filled"
              options={data?.map((option) => option)}
              defaultValue={[]}
              freeSolo
              className="w-full"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  className="bg-[#f3ebeb] w-full max-h-60 overflow-auto"
                  name="branch"
                  {...params}
                  variant="outlined"
                  label=""
                  placeholder="Choose Members"
                  sx={{
                    outline: 'none',
                  }}
                />
              )}
              onChange={(event, value) => handleMembersData(value)}
            />
            {membersError ? <p className="input-block__error">{membersError}</p> : null}
          </div>
        </div>
        {isLoading ? (
          <button className="admin-add__submit my-5" type="button" disabled>
            Submitting...
          </button>
        ) : (
          <button className="admin-add__submit my-5" type="submit" onClick={() => handleSubmit()}>
            Schedule Event
          </button>
        )}
      </form>
    </div>
  )
}

export default EventAddForm
