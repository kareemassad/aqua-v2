'use client'

import { useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const faqList = [
  {
    question: 'What do I get exactly?',
    answer: <div className="space-y-2 leading-relaxed">Loreum Ipseum</div>
  },
  {
    question: 'Can I get a refund?',
    answer: (
      <p>
        Yes! You can request a refund within 7 days of your purchase. Reach out
        by email.
      </p>
    )
  },
  {
    question: 'I have another question',
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email</div>
    )
  }
]

const Item = ({ item }) => {
  const accordion = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? 'text-primary' : ''}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && 'rotate-180'
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && 'rotate-180 hidden'
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  )
}

const FAQ = () => {
  return (
    <section className="bg-gray-50" id="faq">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>What tech stack do you use?</AccordionTrigger>
            <AccordionContent>
              We use a modern tech stack including React, Next.js, and Node.js,
              with options for SQL or NoSQL databases.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I customize the components?</AccordionTrigger>
            <AccordionContent>
              Yes, all our components are fully customizable to fit your brand
              and design needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
            <AccordionContent>
              We offer a 30-day money-back guarantee if you&apos;re not
              satisfied with our product.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
