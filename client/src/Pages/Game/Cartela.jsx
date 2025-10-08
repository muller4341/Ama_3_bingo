
// "use client"

// import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

// const TOGGLED_STORAGE_KEY = "cartela_toggled_state"
// const PATTERN_STORAGE_KEY = "cartela_pattern_state"

// const Cartela = () => {
//   const [cartelas, setCartelas] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [showLimitModal, setShowLimitModal] = useState(false)
//   const [user, setUser] = useState(null)
//   const [toggled, setToggled] = useState(() => {
//     try {
//       const saved = localStorage.getItem(TOGGLED_STORAGE_KEY)
//       return saved ? JSON.parse(saved) : {}
//     } catch {
//       return {}
//     }
//   })
//   const [selectedPattern, setSelectedPattern] = useState(() => {
//     try {
//       const saved = localStorage.getItem(PATTERN_STORAGE_KEY)
//       return saved ? parseInt(saved) : 1 // Default to 1 line
//     } catch {
//       return 1
//     }
//   })
//   const [submitStatus, setSubmitStatus] = useState(null)
//   const { currentUser } = useSelector((state) => state.user)
//   const navigate = useNavigate()
//   const [currentRound, setCurrentRound] = useState(null)
//   const [showRoundModal, setShowRoundModal] = useState(false)

//   // Fetch user function
//   const fetchUser = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await fetch(`/api/user/${currentUser._id}`, { 
//         credentials: 'include' 
//       })
//       if (!res.ok) throw new Error('Failed to fetch user')
//       const data = await res.json()
//       setUser(data)
//       console.log('Fetched user data:', data)
//     } catch (err) {
//       setError('Failed to fetch user.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch user whenever currentUser changes
//   useEffect(() => {
//     if (!currentUser) return
//     fetchUser()
//   }, [currentUser])

//   // Save toggled state to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem(TOGGLED_STORAGE_KEY, JSON.stringify(toggled))
//     } catch {}
//   }, [toggled])

//   // Save pattern state to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem(PATTERN_STORAGE_KEY, selectedPattern.toString())
//     } catch {}
//   }, [selectedPattern])

//   useEffect(() => {
//     fetch("/api/cartelas")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch cartelas")
//         return res.json()
//       })
//       .then((data) => {
//         setCartelas(data.sort((a, b) => a.cartelaNumber - b.cartelaNumber))
//         setLoading(false)
//       })
//       .catch((err) => {
//         setError(err.message)
//         setLoading(false)
//       })
//   }, [])

//   // Toggle on single click, untoggle on double click
//   const handleToggle = (cartelaNumber, isDoubleClick = false) => {
//     setToggled((prev) => {
//       if (isDoubleClick) {
//         if (prev[cartelaNumber]) {
//           return { ...prev, [cartelaNumber]: false }
//         }
//         return prev
//       } else {
//         return { ...prev, [cartelaNumber]: !prev[cartelaNumber] }
//       }
//     })
//   }

//   // Clear all toggled buttons
//   const handleClear = () => {
//     setToggled({})
//     try {
//       localStorage.removeItem(TOGGLED_STORAGE_KEY)
//     } catch {}
//   }

//   const handleSave = async () => {
//     const selected = cartelas.filter((c) => toggled[c.cartelaNumber])
//     if (selected.length === 0) {
//       setSubmitStatus({ success: false, message: "No cartelas selected." })
//       return
//     }
//     const createdBy = currentUser ? currentUser._id : null
//     const totalselectedcartela = selected.length
//     try {
//       console.log("Checking user packages:", user.packages)
//       if (!user || user.packages <= 0) {
//         console.log("User has no packages left or not fetched yet")
//         setShowLimitModal(true)
//         return
//       }
//       const saveRes = await fetch("/api/selectedcartelas", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           createdBy,
//           cartelas: selected.map((c) => ({ cartelaNumber: c.cartelaNumber, grid: c.grid })),
//           totalselectedcartela,
//           numberofwinningpatterns: selectedPattern
//         }),
//       })
//       const data = await saveRes.json()
//       if (saveRes.ok) {
//         const roundNumber = data.data.round
//         setCurrentRound(roundNumber)
//         setShowRoundModal(true)
//         setTimeout(() => {
//           navigate("/game")
//         }, 1000)
//       } else {
//         setSubmitStatus({ success: false, message: data.message || "Failed to save selection." })
//       }
//     } catch (err) {
//       setSubmitStatus({ success: false, message: err.message })
//     }
//   }

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>

//   const rows = []
//   for (let i = 0; i < cartelas.length; i += 20) {
//     rows.push(cartelas.slice(i, i + 20))
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
//       <div className="flex flex-col gap-1 md:gap-2">
//         {rows.map((row, rowIndex) => (
//           <div
//             key={rowIndex}
//             className="flex flex-wrap justify-center gap-1 md:flex-nowrap md:justify-center"
//           >
//             {row.map((cartela) => {
//               const isToggled = toggled[cartela.cartelaNumber]
//               return (
//                 <button
//                   key={cartela.cartelaNumber}
//                   data-grid={JSON.stringify(cartela.grid)}
//                   onClick={() => handleToggle(cartela.cartelaNumber, false)}
//                   onDoubleClick={() => handleToggle(cartela.cartelaNumber, true)}
//                   className="rounded-md w-[88px] h-[80px] md:w-[64px] md:h-[96px] text-3xl font-bold cursor-pointer outline-none flex items-center justify-center transition-all duration-150"
//                   style={{
//                     background: isToggled ? "#ef4444" : "#16a34a",
//                     border: "1.5px solid #e5e7eb",
//                     boxShadow: "0 4px 16px 0 rgba(59,130,246,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04)",
//                     color: isToggled ? "#fff" : "#fff",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.transform = "scale(1.10)"
//                     e.currentTarget.style.filter = "brightness(1.08)"
//                     e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(59,130,246,0.13), 0 2px 8px 0 rgba(0,0,0,0.08)"
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.transform = "scale(1)"
//                     e.currentTarget.style.filter = "brightness(1)"
//                     e.currentTarget.style.boxShadow =
//                       "0 4px 16px 0 rgba(59,130,246,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04)"
//                   }}
//                 >
//                   {cartela.cartelaNumber}
//                 </button>
//               )
//             })}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-10 mt-6 flex-col md:flex-row justify-start items-center ">
//         <div className=" bg-yellow-200 flex flex-col md:flex-row gap-2 p-2 rounded-md justify-center items-center ">
//           <label className="text-green-800 font-bold text-2xl ">Pattern</label>
//            <select
//             value={selectedPattern}
//             onChange={(e) => setSelectedPattern(parseInt(e.target.value))}
//             className="bg-white text-black font-bold px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value={1}>1 Line</option>
//             <option value={2}>2 Lines</option>
//             <option value={3}>3 Lines</option>
//             <option value={4}>4 Lines</option>
//             <option value={5}>All Lines</option>
//           </select>
//            </div>
//         <div className="bg-blue-200 flex flex-col md:flex-row gap-4 p-2  justify-center items-center border rounded-md">
         
//           <div className=" font-extrabold flex flex-row justify-center items-center gap-3 ">
//             <span className="text-yellow-900 text-2xl">Total</span>{" "}
//             <span className="text-blue-900 text-5xl">{Object.values(toggled).filter(Boolean).length}</span>
//           </div>
//         </div>
       
//         {currentRound && (
//           <div className="mb-2 text-2xl font-extrabold">
//             <span className="text-white">Round:</span> <span className="text-green-300">{currentRound}</span>
//           </div>
//         )}
//         <button
//           className="w-full md:flex-1 bg-blue-700 text-white font-semibold px-10 py-2 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
//           type="button"
//           onClick={() => navigate("/dashboard")}
//         >
//           Dashboard
//         </button>
//         <button
//           className="w-full md:flex-1 bg-green-700 text-white font-semibold px-10  py-2 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
//           type="button"
//           onClick={handleSave}
//         >
//           Play
//         </button>
//         <button
//           className="w-full md:flex-1 bg-gradient-to-r bg-red-700 py-2 text-white font-semibold px-10 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
//           type="button"
//           onClick={handleClear}
//         >
//           Clear
//         </button>
//       </div>
//       {showLimitModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
//             <h2 className="text-2xl font-bold text-red-600 mb-4">ፓኬጅዎ አልቋል 🚀 አዲሱን ፓኬጅ አሁኑን ይግዙ!</h2>
//             <p className="text-red-700 mb-6">
//               Package ended 🚀 Buy now!
//             </p>
//             <button
//               onClick={() => setShowLimitModal(false)}
//               className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//       {showRoundModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
//             <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-green-600 mb-4">Round Started!</h2>
//             <p className="text-gray-700 mb-6">
//               <strong>Round {currentRound}</strong> has been started successfully.
//             </p>
//             <div className="text-sm text-gray-500">Redirecting to game in 1 second...</div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Cartela
"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const TOGGLED_STORAGE_KEY = "cartela_toggled_state"
const PATTERN_STORAGE_KEY = "cartela_pattern_state"
const AMOUNT_STORAGE_KEY = "cartela_amount_state"

const Cartela = () => {
  const [cartelas, setCartelas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [user, setUser] = useState(null)
  const [toggled, setToggled] = useState(() => {
    try {
      const saved = localStorage.getItem(TOGGLED_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [selectedPattern, setSelectedPattern] = useState(() => {
    try {
      const saved = localStorage.getItem(PATTERN_STORAGE_KEY)
      return saved ? parseInt(saved) : 1 // Default to 1 line
    } catch {
      return 1
    }
  })
  const [price, setPrice] = useState(() => {
    try {
      const saved = localStorage.getItem(AMOUNT_STORAGE_KEY)
      return saved ? parseInt(saved) : 20
    } catch {
      return 20
    }
  })
  const [submitStatus, setSubmitStatus] = useState(null)
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [currentRound, setCurrentRound] = useState(null)
  const [showRoundModal, setShowRoundModal] = useState(false)

  // Fetch user function
  const fetchUser = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/user/${currentUser._id}`, { 
        credentials: 'include' 
      })
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      setUser(data)
      console.log('Fetched user data:', data)
    } catch (err) {
      setError('Failed to fetch user.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch user whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return
    fetchUser()
  }, [currentUser])

  // Save toggled state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TOGGLED_STORAGE_KEY, JSON.stringify(toggled))
    } catch {}
  }, [toggled])

  // Save pattern state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PATTERN_STORAGE_KEY, selectedPattern.toString())
    } catch {}
  }, [selectedPattern])

  // Save price state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AMOUNT_STORAGE_KEY, price.toString())
    } catch {}
  }, [price])

  useEffect(() => {
    fetch("/api/cartelas")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cartelas")
        return res.json()
      })
      .then((data) => {
        setCartelas(data.sort((a, b) => a.cartelaNumber - b.cartelaNumber))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Toggle on single click, untoggle on double click
  const handleToggle = (cartelaNumber, isDoubleClick = false) => {
    setToggled((prev) => {
      if (isDoubleClick) {
        if (prev[cartelaNumber]) {
          return { ...prev, [cartelaNumber]: false }
        }
        return prev
      } else {
        return { ...prev, [cartelaNumber]: !prev[cartelaNumber] }
      }
    })
  }

  // Clear all toggled buttons
  const handleClear = () => {
    setToggled({})
    try {
      localStorage.removeItem(TOGGLED_STORAGE_KEY)
    } catch {}
  }

  const decreasePrice = () => {
    setPrice((prev) => Math.max(10, prev - 10))
  }

  const increasePrice = () => {
    setPrice((prev) => Math.min(200, prev + 10))
  }

  const handleSave = async () => {
    const selected = cartelas.filter((c) => toggled[c.cartelaNumber])
    if (selected.length === 0) {
      setSubmitStatus({ success: false, message: "No cartelas selected." })
      return
    }
    const createdBy = currentUser ? currentUser._id : null
    const totalselectedcartela = selected.length
    try {
      console.log("Checking user packages:", user.packages)
      if (!user || user.packages <= 0) {
        console.log("User has no packages left or not fetched yet")
        setShowLimitModal(true)
        return
      }
      const saveRes = await fetch("/api/selectedcartelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createdBy,
          cartelas: selected.map((c) => ({ cartelaNumber: c.cartelaNumber, grid: c.grid })),
          totalselectedcartela,
          numberofwinningpatterns: selectedPattern,
          price: price
        }),
      })
      const data = await saveRes.json()
      if (saveRes.ok) {
        const roundNumber = data.data.round
        setCurrentRound(roundNumber)
        setShowRoundModal(true)
        setTimeout(() => {
          navigate("/game")
        }, 1000)
      } else {
        setSubmitStatus({ success: false, message: data.message || "Failed to save selection." })
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message })
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const rows = []
  for (let i = 0; i < cartelas.length; i += 20) {
    rows.push(cartelas.slice(i, i + 20))
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col gap-1 md:gap-2">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap justify-center gap-1 md:flex-nowrap md:justify-center"
          >
            {row.map((cartela) => {
              const isToggled = toggled[cartela.cartelaNumber]
              return (
                <button
                  key={cartela.cartelaNumber}
                  data-grid={JSON.stringify(cartela.grid)}
                  onClick={() => handleToggle(cartela.cartelaNumber, false)}
                  onDoubleClick={() => handleToggle(cartela.cartelaNumber, true)}
                  className="rounded-md w-[88px] h-[80px] md:w-[64px] md:h-[96px] text-3xl font-bold cursor-pointer outline-none flex items-center justify-center transition-all duration-150"
                  style={{
                    background: isToggled ? "#ef4444" : "#16a34a",
                    border: "1.5px solid #e5e7eb",
                    boxShadow: "0 4px 16px 0 rgba(59,130,246,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04)",
                    color: isToggled ? "#fff" : "#fff",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.10)"
                    e.currentTarget.style.filter = "brightness(1.08)"
                    e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(59,130,246,0.13), 0 2px 8px 0 rgba(0,0,0,0.08)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.filter = "brightness(1)"
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px 0 rgba(59,130,246,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04)"
                  }}
                >
                  {cartela.cartelaNumber}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-10 mt-6 flex-col md:flex-row justify-start items-center ">
        <div className="bg-green-200 flex flex-col md:flex-row gap-2 p-2 rounded-md justify-center items-center">
         
          <div className="flex items-center gap-2">
            <button
              onClick={decreasePrice}
              className="bg-white text-black font-bold px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              -
            </button>
            <span className="bg-white text-black font-bold px-4 py-2 rounded-md shadow-md min-w-[60px] text-center text-xl">
              {price}
              <span className="text-green-800 font-bold text-[12px]"> Birr</span>
              
            </span>
             
            <button
              onClick={increasePrice}
              className="bg-white text-black font-bold px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +
            </button>
          </div>
        </div>
        <div className=" bg-green-200 flex flex-col md:flex-row gap-2 p-2 rounded-md justify-center items-center ">
          <label className="text-green-800 font-bold text-2xl ">Pattern</label>
           <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(parseInt(e.target.value))}
            className="bg-white text-black font-semibold px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 border border-green-100"
          >
            <option value={1}>1 Line</option>
            <option value={2}>2 Lines</option>
            <option value={3}>3 Lines</option>
            <option value={4}>4 Lines</option>
            <option value={5}>All Lines</option>
          </select>
           </div>
        <div className="bg-green-200 flex flex-col md:flex-row gap-4 p-2  justify-center items-center border rounded-md">
         
          <div className=" font-extrabold flex flex-row justify-center items-center gap-3 ">
            <span className="text-green-600 text-2xl">Total</span>{" "}
            <span className="text-blue-900 text-4xl">{Object.values(toggled).filter(Boolean).length}</span>
          </div>
        </div>
       
        {currentRound && (
          <div className="mb-2 text-2xl font-extrabold">
            <span className="text-white">Round:</span> <span className="text-green-300">{currentRound}</span>
          </div>
        )}
        <button
          className="w-full md:flex-1 bg-blue-700 text-white font-semibold px-10 py-2 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="w-full md:flex-1 bg-green-700 text-white font-semibold px-10  py-2 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="button"
          onClick={handleSave}
        >
          Play
        </button>
        <button
          className="w-full md:flex-1 bg-gradient-to-r bg-red-700 py-2 text-white font-semibold px-10 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">ፓኬጅዎ አልቋል 🚀 አዲሱን ፓኬጅ አሁኑን ይግዙ!</h2>
            <p className="text-red-700 mb-6">
              Package ended 🚀 Buy now!
            </p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showRoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Round Started!</h2>
            <p className="text-gray-700 mb-6">
              <strong>Round {currentRound}</strong> has been started successfully.
            </p>
            <div className="text-sm text-gray-500">Redirecting to game in 1 second...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cartela