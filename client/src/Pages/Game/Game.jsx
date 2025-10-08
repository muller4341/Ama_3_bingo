
// "use client"

// import { useRef, useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useSelector } from "react-redux"

// // Define static background colors for BINGO letters
// const bingoColumns = [
//   { letter: "B", range: [1, 15], color: "text-blue-600", bg: "bg-blue-500" },
//   { letter: "I", range: [16, 30], color: "text-red-500", bg: "bg-red-500" },
//   { letter: "N", range: [31, 45], color: "text-fuchsia-700", bg: "bg-fuchsia-700" },
//   { letter: "G", range: [46, 60], color: "text-green-600", bg: "bg-green-600" },
//   { letter: "O", range: [61, 75], color: "text-yellow-500", bg: "bg-yellow-500" },
// ]

// const getColumnIndex = (num) => {
//   if (num >= 1 && num <= 15) return 0
//   if (num >= 16 && num <= 30) return 1
//   if (num >= 31 && num <= 45) return 2
//   if (num >= 46 && num <= 60) return 3
//   if (num >= 61 && num <= 75) return 4
//   return -1
// }

// // Helper to get bingo prefix for audio file
// function getBingoPrefix(number) {
//   if (number >= 1 && number <= 15) return "b"
//   if (number >= 16 && number <= 30) return "i"
//   if (number >= 31 && number <= 45) return "n"
//   if (number >= 46 && number <= 60) return "g"
//   if (number >= 61 && number <= 75) return "o"
//   return ""
// }

// function checkBingoWin(grid, calledNumbers, numberOfWinningPatterns) {
//   if (!Array.isArray(grid) || grid.length !== 5 || calledNumbers.length === 0) return false

//   const lastCalledNumber = calledNumbers[calledNumbers.length - 1]

//   // Check if the last called number exists in the cartela
//   let lastNumberExistsInCartela = false
//   for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//       if (grid[i][j] === lastCalledNumber) {
//         lastNumberExistsInCartela = true
//         break
//       }
//     }
//     if (lastNumberExistsInCartela) break
//   }

//   if (!lastNumberExistsInCartela) return false

//   // Get all winning patterns using the existing getWinningPattern function
//   const allWinningPatterns = getWinningPattern(grid, calledNumbers)

//   // Count patterns excluding 'nomarks' for numberOfWinningPatterns
//   const nonNoMarksPatterns = allWinningPatterns.filter(pattern => pattern.type !== "nomarks").length

//   // Special case for 'nomarks' pattern when numberOfWinningPatterns is 1
//   if (numberOfWinningPatterns === 1) {
//     // If any pattern is found (including nomarks), it's a win
//     if (allWinningPatterns.length > 0) {
//       // For non-nomarks patterns, ensure the last called number is part of the pattern
//       if (nonNoMarksPatterns > 0) {
//         for (const pattern of allWinningPatterns) {
//           switch (pattern.type) {
//             case "horizontal":
//               if (grid[pattern.index].includes(lastCalledNumber)) return true
//               break
//             case "vertical":
//               if ([0, 1, 2, 3, 4].some(rowIdx => grid[rowIdx][pattern.index] === lastCalledNumber)) return true
//               break
//             case "diagonal":
//               if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => grid[i][i] === lastCalledNumber)) return true
//               if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => grid[i][4 - i] === lastCalledNumber)) return true
//               break
//             case "corners":
//               const corners = pattern.pattern === "outer" ? [[0, 0], [0, 4], [4, 0], [4, 4]] : [[1, 1], [1, 3], [3, 1], [3, 3]]
//               if (corners.some(([i, j]) => grid[i][j] === lastCalledNumber)) return true
//               break
//           }
//         }
//       } else if (allWinningPatterns.some(pattern => pattern.type === "nomarks")) {
//         // For nomarks, any number in the cartela can trigger the win
//         return true
//       }
//     }
//     return false
//   }

//   // For numberOfWinningPatterns >= 2, check if the number of non-nomarks patterns meets or exceeds the requirement
//   if (numberOfWinningPatterns >= 2) {
//     if (nonNoMarksPatterns >= numberOfWinningPatterns) {
//       // Ensure the last called number is part of at least one of the winning patterns
//       for (const pattern of allWinningPatterns) {
//         if (pattern.type === "nomarks") continue // Skip nomarks for multi-pattern checks
//         switch (pattern.type) {
//           case "horizontal":
//             if (grid[pattern.index].includes(lastCalledNumber)) return true
//             break
//           case "vertical":
//             if ([0, 1, 2, 3, 4].some(rowIdx => grid[rowIdx][pattern.index] === lastCalledNumber)) return true
//             break
//           case "diagonal":
//             if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => grid[i][i] === lastCalledNumber)) return true
//             if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => grid[i][4 - i] === lastCalledNumber)) return true
//             break
//           case "corners":
//             const corners = pattern.pattern === "outer" ? [[0, 0], [0, 4], [4, 0], [4, 4]] : [[1, 1], [1, 3], [3, 1], [3, 3]]
//             if (corners.some(([i, j]) => grid[i][j] === lastCalledNumber)) return true
//             break
//         }
//       }
//     }
//     return false
//   }

//   return false
// }

// function getWinningPattern(grid, calledNumbers) {
//   if (!Array.isArray(grid) || grid.length !== 5) return []
//   const foundPatterns = []

//   // Check horizontal lines
//   for (let i = 0; i < 5; i++) {
//     if (
//       grid[i].every(
//         (val, j) => (val === "FREE" && i === 2 && j === 2) || (typeof val === "number" && calledNumbers.includes(val)),
//       )
//     ) {
//       foundPatterns.push({ type: "horizontal", index: i })
//     }
//   }
//   // Check vertical lines
//   for (let i = 0; i < 5; i++) {
//     if (
//       [0, 1, 2, 3, 4].every((rowIdx) => {
//         const cellValue = grid[rowIdx][i]
//         return (
//           (cellValue === "FREE" && rowIdx === 2 && i === 2) ||
//           (typeof cellValue === "number" && calledNumbers.includes(cellValue))
//         )
//       })
//     ) {
//       foundPatterns.push({ type: "vertical", index: i })
//     }
//   }
//   // Check main diagonal (top-left to bottom-right)
//   if (
//     [0, 1, 2, 3, 4].every(
//       (i) =>
//         (grid[i][i] === "FREE" && i === 2) || (typeof grid[i][i] === "number" && calledNumbers.includes(grid[i][i])),
//     )
//   ) {
//     foundPatterns.push({ type: "diagonal", direction: "main" })
//   }
//   // Check anti-diagonal (top-right to bottom-left)
//   if (
//     [0, 1, 2, 3, 4].every(
//       (i) =>
//         (grid[i][4 - i] === "FREE" && i === 2) ||
//         (typeof grid[i][4 - i] === "number" && calledNumbers.includes(grid[i][4 - i])),
//     )
//   ) {
//     foundPatterns.push({ type: "diagonal", direction: "anti" })
//   }
//   // Check four outer corners
//   const corners = [
//     [0, 0],
//     [0, 4],
//     [4, 0],
//     [4, 4],
//   ]
//   if (corners.every(([i, j]) => typeof grid[i][j] === "number" && calledNumbers.includes(grid[i][j]))) {
//     foundPatterns.push({ type: "corners", pattern: "outer" })
//   }
//   // Check four inner corners
//   const inner = [
//     [1, 1],
//     [1, 3],
//     [3, 1],
//     [3, 3],
//   ]
//   if (inner.every(([i, j]) => typeof grid[i][j] === "number" && calledNumbers.includes(grid[i][j]))) {
//     foundPatterns.push({ type: "corners", pattern: "inner" })
//   }
//   // Check no green marks pattern
//   let marked = 0
//   for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//       if (i === 2 && j === 2) continue
//       if (typeof grid[i][j] === "number" && calledNumbers.includes(grid[i][j])) marked++
//     }
//   }
//   if (marked === 0 && calledNumbers.length >= 15) {
//     foundPatterns.push({ type: "nomarks" })
//   }
//   return foundPatterns
// }

// function isCellInWinningPattern(rowIdx, colIdx, allWinningPatterns) {
//   if (!allWinningPatterns || allWinningPatterns.length === 0) return false
//   for (const pattern of allWinningPatterns) {
//     switch (pattern.type) {
//       case "horizontal":
//         if (rowIdx === pattern.index) return true
//         break
//       case "vertical":
//         if (colIdx === pattern.index) return true
//         break
//       case "diagonal":
//         if (pattern.direction === "main" && rowIdx === colIdx) return true
//         if (pattern.direction === "anti" && rowIdx === 4 - colIdx) return true
//         break
//       case "corners":
//         if (pattern.pattern === "outer") {
//           if (
//             (rowIdx === 0 && colIdx === 0) ||
//             (rowIdx === 0 && colIdx === 4) ||
//             (rowIdx === 4 && colIdx === 0) ||
//             (rowIdx === 4 && colIdx === 4)
//           )
//             return true
//         } else if (pattern.pattern === "inner") {
//           if (
//             (rowIdx === 1 && colIdx === 1) ||
//             (rowIdx === 1 && colIdx === 3) ||
//             (rowIdx === 3 && colIdx === 1) ||
//             (rowIdx === 3 && colIdx === 3)
//           )
//             return true
//         }
//         break
//       case "nomarks":
//         // Only the free space is part of the 'nomarks' pattern visually
//         if (rowIdx === 2 && colIdx === 2) return true
//         break
//     }
//   }
//   return false
// }

// const Game = () => {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [calledNumbers, setCalledNumbers] = useState([])
//   const [lastFiveCalled, setLastFiveCalled] = useState([])
//   const [currentNumber, setCurrentNumber] = useState(null)
//   const { currentUser } = useSelector((state) => state.user)
//   const [price, setPrice] = useState(null)
//   const [recent, setRecent] = useState(null)
//   const [allprice, setAllPrice] = useState(null)
//   const [prizeInfo, setPrizeInfo] = useState(null)
//   const intervalRef = useRef(null)
//   const timeoutRef = useRef(null)
//   const [showCurrent, setShowCurrent] = useState(false)
//   const navigate = useNavigate()
//   const [searchValue, setSearchValue] = useState("")
//   const [searchResult, setSearchResult] = useState(null)
//   const [showPopup, setShowPopup] = useState(false)
//   const [winAudioPlayed, setWinAudioPlayed] = useState(false)
//   const [gameSpeed, setGameSpeed] = useState(5)
//   const [lockedNonWinners, setLockedNonWinners] = useState({})
//   const [isShuffling, setIsShuffling] = useState(false)
//   const [controlAudioLoaded, setControlAudioLoaded] = useState(false)
//   const [audioLoadingProgress, setAudioLoadingProgress] = useState(0)
//   const [allAudioLoaded, setAllAudioLoaded] = useState(false)
//   const [gameSessionStarted, setGameSessionStarted] = useState(false)
//   const [isSubmittingPrice, setIsSubmittingPrice] = useState(false)
//   const [isOnline, setIsOnline] = useState(navigator.onLine)
//   const [pendingSubmissions, setPendingSubmissions] = useState([])
//   const [showOfflineStatus, setShowOfflineStatus] = useState(false)

//   const calledNumbersRef = useRef([])
//   const availableNumbersRef = useRef([])
//   const audioRefs = useRef({})
//   const controlAudioRefs = useRef({})

//   useEffect(() => {
//     availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1)
//   }, [])

//   useEffect(() => {
//     calledNumbersRef.current = calledNumbers
//     availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1).filter(
//       (num) => !calledNumbers.includes(num),
//     )
//     // Update last five called numbers with FIFO logic
//     setLastFiveCalled((prev) => {
//       const newList = [...prev, currentNumber].filter(num => num !== null)
//       if (newList.length > 5) {
//         return newList.slice(-5)
//       }
//       return newList
//     })
//   }, [calledNumbers, currentNumber])

//   useEffect(() => {
//     const preloadAudio = async () => {
//       try {
//         console.log("Starting priority audio preload...")
//         const controlAudios = {
//           play: "/images/Audio/bingo/p.mp3",
//           continue: "/images/Audio/bingo/c.mp3",
//           stop: "/images/Audio/bingo/s.mp3",
//           shuffle: "/images/Audio/bingo/sh.mp3",
//           winner: "/images/Audio/bingo/w.mp3",
//           winnerclap: "/images/Audio/bingo/clap.mp3",
//           try: "/images/Audio/bingo/t.mp3",
//           notFound: "/images/Audio/bingo/n.mp3",
//           pass: "/images/Audio/bingo/pass.mp3",
//         }
//         console.log("Loading control audios first...")
//         const controlPromises = Object.entries(controlAudios).map(([key, path]) => {
//           return new Promise((resolve) => {
//             const audio = new Audio()
//             audio.preload = "auto"
//             audio.volume = 1.0
//             const onReady = () => {
//               controlAudioRefs.current[key] = audio
//               console.log(`✅ Loaded control audio: ${key}`)
//               resolve(true)
//             }
//             const onError = () => {
//               console.warn(`❌ Failed to load control audio: ${key}`)
//               controlAudioRefs.current[key] = audio
//               resolve(false)
//             }
//             audio.addEventListener("canplaythrough", onReady, { once: true })
//             audio.addEventListener("canplay", onReady, { once: true })
//             audio.addEventListener("error", onError, { once: true })
//             audio.src = path
//             audio.load()
//             setTimeout(() => {
//               if (!controlAudioRefs.current[key]) {
//                 console.warn(`⏰ Timeout loading control audio: ${key}`)
//                 controlAudioRefs.current[key] = audio
//                 resolve(false)
//               }
//             }, 3000)
//           })
//         })
//         const controlResults = await Promise.all(controlPromises)
//         const controlSuccessCount = controlResults.filter(Boolean).length
//         console.log(`🎮 Control audios loaded: ${controlSuccessCount}/${controlResults.length}`)
//         setControlAudioLoaded(true)
//         setAudioLoadingProgress(10)

//         console.log("Loading number audios in background...")
//         const numberPromises = []
//         const totalNumbers = 75
//         let loadedNumberCount = 0

//         for (let i = 1; i <= totalNumbers; i++) {
//           const prefix = getBingoPrefix(i)
//           if (!prefix) {
//             console.warn(`Skipping audio for number ${i}: No prefix found.`)
//             continue
//           }
//           const filename = `${prefix}${i}.mp3`
//           const audioPath = `/images/Audio/bingo/${filename}`

//           const promise = new Promise((resolve) => {
//             const audio = new Audio()
//             audio.preload = "auto"
//             audio.volume = 1.0
//             const onReady = () => {
//               audioRefs.current[i] = audio
//               loadedNumberCount++
//               const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
//               setAudioLoadingProgress(Math.round(currentProgress))
//               resolve(true)
//             }
//             const onError = () => {
//               console.warn(`❌ Failed to load number audio: ${filename}`)
//               audioRefs.current[i] = audio
//               loadedNumberCount++
//               const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
//               setAudioLoadingProgress(Math.round(currentProgress))
//               resolve(false)
//             }
//             audio.addEventListener("canplaythrough", onReady, { once: true })
//             audio.addEventListener("canplay", onReady, { once: true })
//             audio.addEventListener("error", onError, { once: true })
//             audio.src = audioPath
//             audio.load()
//             setTimeout(() => {
//               if (!audioRefs.current[i]) {
//                 console.warn(`⏰ Timeout loading number audio: ${filename}`)
//                 audioRefs.current[i] = audio
//                 loadedNumberCount++
//                 const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
//                 setAudioLoadingProgress(Math.round(currentProgress))
//                 resolve(false)
//               }
//             }, 8000)
//           })
//           numberPromises.push(promise)
//         }
//         const numberResults = await Promise.all(numberPromises)
//         const numberSuccessCount = numberResults.filter(Boolean).length
//         console.log(`🔢 Number audios loaded: ${numberSuccessCount}/${numberResults.length}`)
//         setAllAudioLoaded(true)
//         setAudioLoadingProgress(100)
//       } catch (error) {
//         console.warn("Audio preloading error:", error)
//         setControlAudioLoaded(true)
//         setAllAudioLoaded(true)
//         setAudioLoadingProgress(100)
//       }
//     }
//     preloadAudio()
//     return () => {
//       Object.values(audioRefs.current).forEach((audio) => {
//         if (audio) {
//           audio.pause()
//           audio.currentTime = 0
//           audio.src = ""
//         }
//       })
//       Object.values(controlAudioRefs.current).forEach((audio) => {
//         if (audio) {
//           audio.pause()
//           audio.currentTime = 0
//           audio.src = ""
//         }
//       })
//     }
//   }, [])

//   const playControlAudio = (type) => {
//     try {
//       const audio = controlAudioRefs.current[type]
//       if (audio) {
//         audio.currentTime = 0
//         if (audio.readyState >= 2) {
//           const playPromise = audio.play()
//           if (playPromise) {
//             playPromise.catch((error) => {
//               console.warn(`Failed to play control audio ${type}:`, error)
//             })
//           }
//         } else {
//           console.warn(`Control audio ${type} not ready, forcing load...`)
//           audio.load()
//           audio.addEventListener(
//             "canplay",
//             () => {
//               audio.play().catch((error) => {
//                 console.warn(`Failed to play control audio ${type} after load:`, error)
//               })
//             },
//             { once: true },
//           )
//         }
//       } else {
//         console.warn(`Control audio ${type} not found`)
//       }
//     } catch (error) {
//       console.warn(`Error playing control audio ${type}:`, error)
//     }
//   }

//   const playNumberAudio = (number) => {
//     try {
//       const audio = audioRefs.current[number]
//       if (audio) {
//         audio.currentTime = 0
//         if (audio.readyState >= 2) {
//           const playPromise = audio.play()
//           if (playPromise) {
//             playPromise.catch((error) => {
//               console.warn(`Failed to play number audio ${number}:`, error)
//             })
//           }
//         } else {
//           console.warn(`Number audio ${number} not ready, forcing load...`)
//           audio.load()
//           audio.addEventListener(
//             "canplay",
//             () => {
//               audio.play().catch((error) => {
//                 console.warn(`Failed to play number audio ${number} after load:`, error)
//               })
//             },
//             { once: true },
//           )
//         }
//       } else {
//         console.warn(`Number audio ${number} not found`)
//       }
//     } catch (error) {
//       console.warn(`Error playing number audio ${number}:`, error)
//     }
//   }

//   let lastFoundInCartela = null
//   if (searchResult?.cartela?.grid) {
//     const cartelaNumbers = searchResult.cartela.grid.flat().filter((v) => typeof v === "number")
//     for (let i = calledNumbers.length - 1; i >= 0; i--) {
//       if (cartelaNumbers.includes(calledNumbers[i])) {
//         lastFoundInCartela = calledNumbers[i]
//         break
//       }
//     }
//   }

//   const generateNextNumber = () => {
//     const available = availableNumbersRef.current
//     const loadedAvailableNumbers = available.filter((num) => {
//       const audio = audioRefs.current[num]
//       return audio && audio.readyState >= 2
//     })

//     if (loadedAvailableNumbers.length === 0) {
//       console.warn("No more numbers with loaded audio available to call.")
//       if (isPlaying) {
//         stopGame()
//       }
//       return null
//     }

//     const randomIndex = Math.floor(Math.random() * loadedAvailableNumbers.length)
//     const nextNumber = loadedAvailableNumbers[randomIndex]
//     console.log(`Generated number: ${nextNumber}, Available loaded count: ${loadedAvailableNumbers.length}`)

//     playNumberAudio(nextNumber)

//     setCurrentNumber(nextNumber)
//     setCalledNumbers((prev) => {
//       const newCalledNumbers = [...prev, nextNumber]
//       console.log(`Updated called numbers: ${newCalledNumbers.length}/75`)
//       return newCalledNumbers
//     })
//     calledNumbersRef.current = [...calledNumbersRef.current, nextNumber]
//     availableNumbersRef.current = available.filter((num) => num !== nextNumber)
//     return nextNumber
//   }

//   useEffect(() => {
//     const handleOnline = () => {
//       console.log("[v0] Internet connection restored - going online")
//       setIsOnline(true)
//       setShowOfflineStatus(false)
//       console.log("[v0] Calling processPendingSubmissions after going online")
//       processPendingSubmissions()
//     }

//     const handleOffline = () => {
//       console.log("[v0] Internet connection lost - going offline")
//       setIsOnline(false)
//       setShowOfflineStatus(true)
//     }

//     const loadPendingSubmissions = () => {
//       console.log("[v0] Loading pending submissions from localStorage")
//       try {
//         const stored = localStorage.getItem("pendingGameSubmissions")
//         if (stored) {
//           const pending = JSON.parse(stored)
//           console.log("[v0] Found pending submissions:", pending.length)
//           setPendingSubmissions(pending)
//           if (pending.length > 0 && navigator.onLine) {
//             console.log("[v0] Processing pending submissions on component mount")
//             processPendingSubmissions()
//           }
//         } else {
//           console.log("[v0] No pending submissions found in localStorage")
//         }
//       } catch (error) {
//         console.error("[v0] Error loading pending submissions:", error)
//       }
//     }

//     console.log("[v0] Setting up online/offline event listeners")
//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)
//     loadPendingSubmissions()

//     return () => {
//       console.log("[v0] Cleaning up online/offline event listeners")
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   const processPendingSubmissions = async () => {
//     console.log("[v0] processPendingSubmissions called")
//     const stored = localStorage.getItem("pendingGameSubmissions")
//     if (!stored) {
//       console.log("[v0] No stored submissions found")
//       return
//     }

//     try {
//       const pending = JSON.parse(stored)
//       if (pending.length === 0) {
//         console.log("[v0] Pending submissions array is empty")
//         return
//       }

//       console.log(`[v0] Processing ${pending.length} pending submissions...`)

//       for (const submission of pending) {
//         try {
//           console.log("[v0] Submitting pending data:", submission.id)
//           const res = await fetch("/api/price/allprice", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(submission.data),
//           })

//           if (res.ok) {
//             console.log("[v0] Successfully submitted pending data:", submission.id)
//           } else {
//             console.warn("[v0] Failed to submit pending data:", submission.id, res.status)
//           }
//         } catch (error) {
//           console.warn("[v0] Error submitting pending data:", error)
//         }
//       }

//       console.log("[v0] Clearing pending submissions from localStorage")
//       localStorage.removeItem("pendingGameSubmissions")
//       setPendingSubmissions([])
//     } catch (error) {
//       console.error("[v0] Error processing pending submissions:", error)
//     }
//   }

//   const storePendingSubmission = (submissionData) => {
//     console.log("[v0] Storing submission for offline processing")
//     const submission = {
//       id: Date.now() + Math.random(),
//       data: submissionData,
//       timestamp: new Date().toISOString(),
//     }

//     try {
//       const existing = localStorage.getItem("pendingGameSubmissions")
//       const pending = existing ? JSON.parse(existing) : []
//       pending.push(submission)
//       localStorage.setItem("pendingGameSubmissions", JSON.stringify(pending))
//       setPendingSubmissions(pending)
//       console.log("[v0] Stored submission for offline processing:", submission.id)
//       console.log("[v0] Total pending submissions:", pending.length)
//     } catch (error) {
//       console.error("[v0] Error storing pending submission:", error)
//     }
//   }

//   const startGame = async () => {
//     if (isPlaying) return

//     const isGameFinished = calledNumbers.length === 75
//     const isInitialStart = calledNumbers.length === 0 && currentNumber === null

//     if (isGameFinished || (isInitialStart && !gameSessionStarted)) {
//       setCalledNumbers([])
//       setCurrentNumber(null)
//       calledNumbersRef.current = []
//       availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1)
//       setLockedNonWinners({})
//       setGameSessionStarted(false)
//       setIsSubmittingPrice(false)
//     }

//     if (
//       !gameSessionStarted &&
//       !isSubmittingPrice &&
//       price &&
//       recent &&
//       price.createdBy === currentUser._id &&
//       recent.createdBy === currentUser._id &&
//       prizeInfo &&
//       recent.totalselectedcartela > 3
//     ) {
//       const today = new Date().toISOString().split("T")[0]
//       const todaysRounds = Array.isArray(allprice)
//         ? allprice.filter(
//             (p) => p.createdBy === currentUser._id && new Date(p.createdAt).toISOString().split("T")[0] === today,
//           )
//         : []
//       const lastRound = todaysRounds.length > 0 ? todaysRounds[todaysRounds.length - 1].round : 0

//       console.log("lastRound:", lastRound)
//       console.log("recent.round:", recent.round)
//       console.log("Comparison (lastRound !== Number(recent.round)):", lastRound !== Number(recent.round))

//       if (lastRound !== Number(recent.round)) {
//         setIsSubmittingPrice(true)

//         const submissionData = {
//           createdBy: currentUser._id,
//           Total: prizeInfo.total.toString(),
//           WinnerPrize: prizeInfo.winnerPrize.toString(),
//           HostingRent: prizeInfo.rentAmount.toString(),
//           round: prizeInfo.round.toString(),
//           winRemains: prizeInfo.winRemains.toString(),
//         }

//         if (!isOnline) {
//           console.log("[v0] Submit from internet off - storing data offline")
//           storePendingSubmission(submissionData)
//           setGameSessionStarted(true)
//           setIsSubmittingPrice(false)
//           console.log("[v0] Stored submission offline - game can proceed")
//         } else {
//           console.log("[v0] Submit with internet on - attempting normal submission")
//           try {
//             const res = await fetch("/api/price/allprice", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(submissionData),
//             })
//             const data = await res.json()
//             if (res.ok && data.success) {
//               setGameSessionStarted(true)
//             }
//           } catch (err) {
//             console.warn("Error storing price:", err)
//             storePendingSubmission(submissionData)
//             setGameSessionStarted(true)
//           } finally {
//             setIsSubmittingPrice(false)
//           }
//         }
//       }
//     }

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//       intervalRef.current = null
//     }
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current)
//       timeoutRef.current = null
//     }

//     setIsPlaying(true)
//     setTimeout(() => {
//       playControlAudio(isInitialStart ? "play" : "continue")
//     }, 0)

//     timeoutRef.current = setTimeout(() => {
//       const firstNumber = generateNextNumber()
//       if (firstNumber === null) {
//         stopGame()
//         return
//       }
//       intervalRef.current = setInterval(() => {
//         const num = generateNextNumber()
//         if (num === null) {
//           stopGame()
//         }
//       }, gameSpeed * 1000)
//     }, 3000)
//   }

//   const stopGame = () => {
//     playControlAudio("stop")
//     setIsPlaying(false)
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//       intervalRef.current = null
//     }
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current)
//       timeoutRef.current = null
//     }
//   }

//   const handleShuffle = () => {
//     playControlAudio("shuffle")
//     setIsShuffling(true)
//     setTimeout(() => {
//       setIsShuffling(false)
//     }, 2700)
//   }

//   const updateGameSpeed = () => {
//     if (isPlaying && intervalRef.current) {
//       clearInterval(intervalRef.current)
//       intervalRef.current = setInterval(() => {
//         const num = generateNextNumber()
//         if (num === null) {
//           stopGame()
//         }
//       }, gameSpeed * 1000)
//     }
//   }

//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current)
//       if (timeoutRef.current) clearTimeout(timeoutRef.current)
//     }
//   }, [])

//   useEffect(() => {
//     if (currentNumber !== null) {
//       setShowCurrent(true)
//       const timeout = setTimeout(() => setShowCurrent(false), 2500)
//       return () => clearTimeout(timeout)
//     }
//   }, [currentNumber])

//   useEffect(() => {
//     if (!currentUser || !currentUser._id) return
//     fetch("/api/price/me")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.data && data.data.createdBy === currentUser._id) {
//           setPrice(data.data)
//         }
//       })
//     fetch("/api/selectedcartelas/recent")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.data && data.data.createdBy === currentUser._id) {
//           setRecent(data.data)
//         }
//       })
//     fetch("/api/price/allprice")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.data && Array.isArray(data.data.byDay)) {
//           setAllPrice(data.data.byDay)
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching allprice:", error)
//       })
//   }, [currentUser])

//   useEffect(() => {
//     if (price && recent && typeof recent.totalselectedcartela === "number") {
//       const amount = Number(price.amount)
//       const round = Number(recent.round)
//       const rentpercent = Number(price.rentpercent) / 100
//       const numberOfSelectedCartelas = recent.totalselectedcartela
//       const total = amount * numberOfSelectedCartelas
//       let rentAmount = 0
//       if (recent.totalselectedcartela > 3) {
//         rentAmount = amount * rentpercent * numberOfSelectedCartelas
//       }

//       const winnerPrize = total - rentAmount
//       const winRemains = winnerPrize % 10
//       setPrizeInfo({ total, rentAmount, winnerPrize, round, winRemains })
//     }
//   }, [price, recent])

//   const handleCheck = async () => {
//     setSearchResult(null)
//     setShowPopup(false)
//     setWinAudioPlayed(false)
//     if (!searchValue.trim()) return

//     const cartelaNumber = String(searchValue.trim())
//     const allCartelas = Array.isArray(recent?.cartelas) ? recent.cartelas : []
//     const foundCartelaObject = allCartelas.find((cartela) => String(cartela.cartelaNumber) === cartelaNumber)

//     if (!foundCartelaObject) {
//       setSearchResult({
//         cartela: { cartelaNumber: cartelaNumber, grid: [] },
//         isWinner: false,
//         isLocked: false,
//         notFound: true,
//       })
//       setShowPopup(true)
//       return
//     }

//     const cartelaGrid = foundCartelaObject.grid

//     if (lockedNonWinners[cartelaNumber]) {
//       setSearchResult({
//         cartela: { cartelaNumber: cartelaNumber, grid: cartelaGrid },
//         isWinner: false,
//         isLocked: true,
//         notFound: false,
//       })
//       setShowPopup(true)
//       return
//     }

//     // Use numberOfSelectedCartelas as the number of required winning patterns
//     const numberOfWinningPatterns = recent?.numberofwinningpatterns || 1
//     const isWinner = checkBingoWin(cartelaGrid, calledNumbers, numberOfWinningPatterns)
//     const allWinningPatterns = getWinningPattern(cartelaGrid, calledNumbers)
//     const nonNoMarksPatterns = allWinningPatterns.filter(pattern => pattern.type !== "nomarks").length
//     const lastCalledNumber = calledNumbers[calledNumbers.length - 1]
//     let isLastCalledInWinningPattern = false

//     if (nonNoMarksPatterns >= numberOfWinningPatterns) {
//       for (const pattern of allWinningPatterns) {
//         if (pattern.type === "nomarks") {
//           isLastCalledInWinningPattern = true
//           break
//         }
//         switch (pattern.type) {
//           case "horizontal":
//             if (cartelaGrid[pattern.index].includes(lastCalledNumber)) {
//               isLastCalledInWinningPattern = true
//             }
//             break
//           case "vertical":
//             if ([0, 1, 2, 3, 4].some(rowIdx => cartelaGrid[rowIdx][pattern.index] === lastCalledNumber)) {
//               isLastCalledInWinningPattern = true
//             }
//             break
//           case "diagonal":
//             if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => cartelaGrid[i][i] === lastCalledNumber)) {
//               isLastCalledInWinningPattern = true
//             }
//             if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => cartelaGrid[i][4 - i] === lastCalledNumber)) {
//               isLastCalledInWinningPattern = true
//             }
//             break
//           case "corners":
//             const corners = pattern.pattern === "outer" ? [[0, 0], [0, 4], [4, 0], [4, 4]] : [[1, 1], [1, 3], [3, 1], [3, 3]]
//             if (corners.some(([i, j]) => cartelaGrid[i][j] === lastCalledNumber)) {
//               isLastCalledInWinningPattern = true
//             }
//             break
//         }
//         if (isLastCalledInWinningPattern) break
//       }
//     }

//     // Lock non-winning cartelas or those that missed the last call
//     if (!isWinner || (nonNoMarksPatterns >= numberOfWinningPatterns && !isLastCalledInWinningPattern)) {
//       setLockedNonWinners((prev) => ({
//         ...prev,
//         [cartelaNumber]: true,
//       }))
//     }

//     setSearchResult({
//       cartela: { cartelaNumber: cartelaNumber, grid: cartelaGrid },
//       isWinner: isWinner,
//       isLocked: !isWinner && lockedNonWinners[cartelaNumber],
//       notFound: false,
//       missedLastCall: nonNoMarksPatterns >= numberOfWinningPatterns && !isLastCalledInWinningPattern,
//       insufficientPatterns: nonNoMarksPatterns < numberOfWinningPatterns,
//     })
//     setShowPopup(true)
//   }

//   useEffect(() => {
//     if (!showPopup) setWinAudioPlayed(false)
//   }, [showPopup])

//   useEffect(() => {
//     if (isPlaying) {
//       updateGameSpeed()
//     }
//   }, [gameSpeed, isPlaying])

//   const animationStyle = `
//     @keyframes moveInFromBottomRight {
//       0% { opacity: 0; transform: translate(120px, 120px) scale(0.2); }
//       60% { opacity: 1; transform: translate(-10px, -10px) scale(1.1); }
//       100% { opacity: 1; transform: translate(0, 0) scale(1); }
//     }
//     @keyframes blink {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.2; }
//     }
//     .blink { animation: blink 1s linear infinite; }
//     @keyframes flash-bw-colors {
//       0% { background-color: #4b5563; }
//       50% { background-color: #111827; }
//       100% { background-color: #4b5563; }
//     }
//     .shuffle-effect {
//       animation-name: flash-bw-colors;
//       animation-duration: 1s;
//       animation-iteration-count: infinite;
//       animation-timing-function: linear;
//       background-image: none !important;
//       border-color: transparent !important;
//       color: #22c55e !important;
//     }
//   `

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
//       <div className="fixed top-4 right-4 z-40">
//         <div
//           className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
//             isOnline ? "bg-green-600 text-white" : "bg-red-600 text-white animate-pulse"
//           }`}
//         >
//           <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-300" : "bg-red-300"}`}></div>
//           {isOnline ? "Online" : "Offline"}
//           {pendingSubmissions.length > 0 && (
//             <span className="bg-black bg-opacity-30 px-2 py-0.5 rounded text-xs">{pendingSubmissions.length}</span>
//           )}
//         </div>
//       </div>
//       <style>{animationStyle}</style>
//       <div className="min-h-screen bg-green-800 flex flex-col items-center justify-start">
//         <div className="flex flex-col rounded-3xl shadow-xl">
//           <div className="flex flex-col md:flex-row w-full md:w-auto bg-gray-800 rounded-md justify-center items-center mx-2 p-2">
//             <div className="flex flex-row md:flex-col font-extrabold text-2xl md:text-4xl tracking-widest h-full w-full md:w-auto md:items-start p-2 gap-2">
//               {bingoColumns.map((col) => (
//                 <button
//                   key={col.letter}
//                   className={`h-12 md:h-20 w-12 md:w-16 mb-0 rounded-md text-white shadow ${col.bg}`}
//                   disabled
//                 >
//                   {col.letter}
//                 </button>
//               ))}
//             </div>
//             <div className="flex flex-col gap-2 md:gap-6 h-full w-full justify-center items-center p-2">
//               {bingoColumns.map((col, colIdx) => (
//                 <div
//                   key={col.letter}
//                   className="flex flex-row items-center h-12 md:h-16 w-full flex-wrap md:flex-nowrap justify-center"
//                 >
//                   {Array.from({ length: col.range[1] - col.range[0] + 1 }, (_, i) => {
//                     const num = col.range[0] + i
//                     const isCalled = calledNumbers.includes(num)
//                     return (
//                       <button
//                         key={num}
//                         className={`h-12 md:h-[5.5rem] w-12 md:w-[4.75rem] mr-1 md:mr-2 rounded-lg md:rounded-md font-bold text-lg md:text-4xl shadow-md transition-all duration-150 ${
//                           isShuffling
//                             ? "shuffle-effect"
//                             : isCalled
//                               ? `${col.bg} text-white border-fuchsia-600 scale-105`
//                               : "bg-gray-600 text-white hover:scale-105 hover:border-fuchsia-400 border border-gray-300"
//                         }`}
//                         style={isShuffling ? { animationDelay: `${Math.random() * 2.6}s` } : {}}
//                         disabled
//                       >
//                         {num}
//                       </button>
//                     )
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-[100%] lg:w-[100%] gap-8 py-2 px-10 bg-green-600 md:mt-4 rounded-lg mx-auto shadow-lg">
//          <div className="flex flex-1 flex-col items-center justify-center min-w-[300px] mt-2 bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-4 border-2 border-fuchsia-300">
//             <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold text-fuchsia-800">Last Five </p>
//             <div className="flex flex-row justify-center gap-2 min-h-[48px]">
//               {lastFiveCalled.length === 0 ? (
//                 <p className="text-sm text-gray-600 self-center">No numbers </p>
//               ) : (
//                 lastFiveCalled.map((num, index) => {
//                   const colIdx = getColumnIndex(num)
//                   const col = bingoColumns[colIdx]
//                   return (
//                     <div
//                       key={index}
//                       className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${col.bg} border-2 border-fuchsia-300 shadow-md`}
//                     >
//                       {num}
//                     </div>
//                   )
//                 })
//               )}
//             </div>
//           </div>
          
//           <div className="flex-col flex-1 w-full max-w-md mx-auto bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-4 border-2 border-fuchsia-300">
//             <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
//               <button
//                 className="flex items-center gap-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
//                 type="button"
//                 onClick={() => navigate("/play")}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//                 End
//               </button>
//               <button
//                 className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed text-white ${
//                   isPlaying ? "bg-red-500" : "bg-green-500"
//                 }`}
//                 type="button"
//                 onClick={isPlaying ? stopGame : startGame}
//                 disabled={!controlAudioLoaded}
//               >
//                 {isPlaying ? (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Stop
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                     </svg>
//                     {controlAudioLoaded ? "Play" : "Loading..."}
//                   </>
//                 )}
//               </button>
//               <button
//                 className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
//                 type="button"
//                 onClick={handleShuffle}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582l3.65-4.285A1 1 0 0110 5v14a1 1 0 01-1.768.64l-3.65-4.285H4v5h16V4H4z"
//                   />
//                 </svg>
//                 Shuffle
//               </button>
//             </div>
//             <div className="bg-white flex flex-row items-center justify-center w-full max-w-md p-1 rounded-lg mt-2 shadow border border-yellow-200">
//               <input
//                 type="text"
//                 placeholder="Search cartela number..."
//                 className="border-none outline-none rounded-lg h-9 p-2 w-full max-w-md text-fuchsia-800 placeholder-fuchsia-400 bg-transparent focus:ring-2 focus:ring-fuchsia-300 text-sm"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCheck()
//                 }}
//               />
//               <button
//                 className="flex items-center gap-1 bg-blue-500 text-white rounded-lg p-2 ml-2 shadow hover:bg-blue-600 transition text-xs h-8"
//                 onClick={handleCheck}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-3 w-3"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
//                   />
//                 </svg>
//                 Check
//               </button>
//             </div>
//           </div>
//           <div className="flex flex-1 flex-col items-center justify-center w-full mt-2 bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-4 border-2 border-fuchsia-300">
//             <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2">
//               <span className="text-fuchsia-800">progress</span>
              
//             </p>
//             {/* <div className="w-full max-w-md h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-fuchsia-200">
//               <div
//                 className="h-full bg-gradient-to-r from-fuchsia-500 via-yellow-400 to-green-500 transition-all duration-500"
//                 style={{ width: `${(calledNumbers.length / 75) * 100}%` }}
//               ></div>
//             </div> */}
//             {/* <span className="mt-1 text-sm text-fuchsia-700 font-semibold">
//               {Math.round((calledNumbers.length / 75) * 100)}%
//             </span> */}
//             <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2"> 
//               <span className="text-green-700 text-3xl font-black">{calledNumbers.length}</span>
//               <span className="text-fuchsia-400 text-3xl font-black">/</span>
//               <span className="text-yellow-500 text-3xl font-black">75</span> </p>
//           </div>
//           <div className="flex flex-col items-center w-full mt-3 gap-2 bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-4 border-2 border-fuchsia-300">
//             <label className="text-sm font-semibold text-fuchsia-800">Speed: {gameSpeed}s</label>
//             <div className="flex items-center gap-2 w-full max-w-xs">
//               <span className="text-xs text-fuchsia-600 font-medium">1s</span>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={gameSpeed}
//                 onChange={(e) => setGameSpeed(Number(e.target.value))}
//                 disabled={isPlaying}
//                 className="flex-1 h-2 bg-gradient-to-r from-green-200 to-fuchsia-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
//                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
//                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fuchsia-500 [&::-webkit-slider-thumb]:cursor-pointer
//                   [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
//                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
//                    [&::-moz-range-thumb]:bg-fuchsia-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
//               />
//               <span className="text-xs text-fuchsia-600 font-medium">10s</span>
//             </div>
//             <p className="text-xs text-fuchsia-600 text-center">
//               {isPlaying ? "Speed locked during game" : "Adjust speed"}
//             </p>
//           </div>
//           {/* <div className="flex flex-1 flex-col items-center justify-center w-full mt-2 bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-4 border-2 border-fuchsia-300">
//             <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex gap-2 flex-col items-center">
//               <span className="text-fuchsia-800">ባለ</span>
//               <span className="text-green-700 text-3xl font-black">
//                 {price ? price.amount : 0} <span className="text-red-600">ብር</span>
//               </span>
//             </p>
//           </div> */}
//           <div className="flex flex-1 flex-col items-center justify-center w-full mt-2 bg-gradient-to-r from-fuchsia-200 via-yellow-100 to-green-200 rounded-xl shadow-lg p-2 border-2 border-fuchsia-300 gap-2">

//             <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex gap-2 flex-row items-center">
//               <span className="text-fuchsia-800">ባለ</span>
//               <span className="text-green-700 text-1xl font-black">
//                 {price ? price.amount : 0} <span className="text-red-600">ብር</span>
//               </span>
//             </p>
//             <div>
//               <p className="text-2xl font-bold text-fuchsia-700">Win</p>
//             </div>
//             {prizeInfo && (
//               <div className="flex items-end gap-1">
//                 <span className="text-6xl font-extrabold text-green-600">{Math.trunc(prizeInfo.winnerPrize)}</span>
//                 <span className="text-2xl font-bold text-fuchsia-500">Birr</span>
//               </div>
//             )}
//           </div>
//         </div>
//         {showCurrent &&
//           currentNumber !== null &&
//           calledNumbers.length > 0 &&
//           calledNumbers[calledNumbers.length - 1] === currentNumber && (
//             <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
//               <div
//                 className={`relative flex items-center justify-center w-[180px] h-[180px] md:w-[260px] md:h-[260px] border-4 border-fuchsia-400 rounded-full shadow-2xl ${bingoColumns[getColumnIndex(currentNumber)].bg} pointer-events-auto`}
//               >
//                 <span
//                   style={{
//                     fontSize: "8rem",
//                     fontWeight: 900,
//                     animation: "moveInFromBottomRight 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
//                   }}
//                   className="drop-shadow-lg text-white"
//                 >
//                   {currentNumber}
//                 </span>
//               </div>
//             </div>
//           )}
//         {showPopup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//             <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 border-2 border-gradient-to-r from-blue-300 to-purple-300">
//               {searchResult?.notFound ? (
//                 <>
//                   <div className="text-center">
//                     <div className="mb-6">
//                       <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                         <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </div>
//                       <h2 className="text-3xl font-bold text-red-600 mb-2">Cartela Not Found</h2>
//                       <p className="text-gray-600">The cartela number you searched for doesn't exist.</p>
//                     </div>
//                     {!winAudioPlayed &&
//                       (() => {
//                         playControlAudio("notFound")
//                         setWinAudioPlayed(true)
//                         return null
//                       })()}
//                     <button
//                       className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
//                       onClick={() => setShowPopup(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </>
//               ) : searchResult?.isLocked ? (
//                 <>
//                   <div className="text-center">
//                     <div className="mb-6">
//                       <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//                         <svg
//                           className="w-10 h-10 text-orange-500"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                           />
//                         </svg>
//                       </div>
//                       <h2 className="text-2xl font-bold text-orange-600 mb-2">Cartela Locked</h2>
//                       <p className="text-gray-600 text-sm">
//                         Cartela #{searchResult.cartela.cartelaNumber} was previously checked and is not a winner. It is
//                         locked for this game.
//                       </p>
//                     </div>
//                     <button
//                       className="px-6 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold text-base shadow-md hover:from-orange-500 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200"
//                       onClick={() => setShowPopup(false)}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 (() => {
//                   const grid = searchResult.cartela.grid
//                   const isWinner = searchResult.isWinner
//                   const missedLastCall = searchResult.missedLastCall
//                   const insufficientPatterns = searchResult.insufficientPatterns
//                   const allWinningPatterns = isWinner ? getWinningPattern(grid, calledNumbers) : []

//                   if (!winAudioPlayed) {
//                     if (isWinner) {
//                       const winnerAudio = new Audio("/images/Audio/bingo/w.mp3")
//                       const clapAudio = new Audio("/images/Audio/bingo/clap.mp3")
//                       winnerAudio.addEventListener("loadedmetadata", () => {
//                         const timeToClap = Math.max((winnerAudio.duration - 0.5) * 1000, 0)
//                         setTimeout(() => {
//                           clapAudio.play()
//                         }, timeToClap)
//                       })
//                       winnerAudio.play()
//                     } else if (missedLastCall) {
//                       playControlAudio("pass")
//                     } else if (insufficientPatterns) {
//                       playControlAudio("try")
//                     } else {
//                       playControlAudio("try")
//                     }
//                     setWinAudioPlayed(true)
//                   }

//                   return (
//                     <>
//                       <div className="text-center mb-4">
//                         <div className="flex items-center justify-center gap-2 mb-3">
//                           <div
//                             className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                               isWinner
//                                 ? "bg-gradient-to-br from-green-300 to-blue-400"
//                                 : "bg-gradient-to-br from-red-300 to-orange-400"
//                             }`}
//                           >
//                             {isWinner ? (
//                               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                 />
//                               </svg>
//                             ) : (
//                               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M6 18L18 6M6 6l12 12"
//                                 />
//                               </svg>
//                             )}
//                           </div>
//                           <div>
//                             <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
//                               Cartela #{searchResult.cartela.cartelaNumber}
//                             </h2>
//                           </div>
//                         </div>
//                         <div className={`text-lg font-semibold ${isWinner ? "text-green-600" : "text-red-600"}`}>
//                           {isWinner
//                             ? "Congratulations! This cartela is a winner!"
//                             : missedLastCall
//                               ? "This cartela has enough patterns but missed the last called number."
//                               : "This cartela does not have enough winning patterns. It has been locked for this game."}
//                         </div>
//                       </div>
//                       <div className="rounded-xl p-2 shadow-inner border border-gray-100">
//                         <div className="flex justify-center mb-3">
//                           {bingoColumns.map((col, index) => (
//                             <div
//                               key={col.letter}
//                               className={`w-12 h-10 bg-fuchsia-200 flex items-center justify-center rounded-t-md font-bold text-2xl text-white shadow-sm ${col.bg} ${index === 0 ? "rounded-tl-md" : ""} ${index === bingoColumns.length - 1 ? "rounded-tr-md" : ""}`}
//                             >
//                               {col.letter}
//                             </div>
//                           ))}
//                         </div>
//                         <div className="flex flex-col gap-1">
//                           {grid &&
//                             grid.map((row, rowIdx) => (
//                               <div key={rowIdx} className="flex gap-1 justify-center">
//                                 {row.map((val, colIdx) => {
//                                   const isNum = typeof val === "number"
//                                   const isCalled = isNum && calledNumbers.includes(val)
//                                   const isLast = isNum && val === lastFoundInCartela
//                                   const columnColor = bingoColumns[colIdx]
//                                   const isInWinningPattern =
//                                     isWinner && isCellInWinningPattern(rowIdx, colIdx, allWinningPatterns)
//                                   return (
//                                     <div
//                                       key={colIdx}
//                                       className={`w-12 h-10 flex items-center justify-center rounded-md font-semibold text-base border-2 transition-all duration-300 ${
//                                         isNum
//                                           ? isInWinningPattern
//                                             ? "bg-gradient-to-br from-green-300 to-green-500 text-white border-green-600 shadow-md transform scale-105 ring-1 ring-green-200"
//                                             : isCalled
//                                               ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white border-yellow-600 shadow-md transform scale-105"
//                                               : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 border-gray-200 hover:shadow-sm"
//                                           : isInWinningPattern
//                                             ? "bg-gradient-to-br from-green-300 to-green-500 text-white border-green-600 font-bold text-sm ring-1 ring-green-200"
//                                             : "bg-gradient-to-br from-yellow-300 to-orange-300 text-white border-yellow-400 font-bold text-sm"
//                                       } ${isLast ? "ring-2 ring-pink-300 ring-opacity-75 animate-pulse" : ""}`}
//                                     >
//                                       {val === "FREE" ? <span className="text-xs font-bold">FREE</span> : val}
//                                     </div>
//                                   )
//                                 })}
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                       <div className="text-center mt-4">
//                         <button
//                           className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg font-semibold text-base shadow-md hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
//                           onClick={() => setShowPopup(false)}
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </>
//                   )
//                 })()
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// export default Game


"use client"

import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

// Define static background colors for BINGO letters
const bingoColumns = [
  { letter: "B", range: [1, 15], color: "text-blue-600", bg: "bg-blue-500" },
  { letter: "I", range: [16, 30], color: "text-red-500", bg: "bg-red-500" },
  { letter: "N", range: [31, 45], color: "text-fuchsia-700", bg: "bg-fuchsia-700" },
  { letter: "G", range: [46, 60], color: "text-green-600", bg: "bg-green-600" },
  { letter: "O", range: [61, 75], color: "text-yellow-500", bg: "bg-yellow-500" },
]

const getColumnIndex = (num) => {
  if (num >= 1 && num <= 15) return 0
  if (num >= 16 && num <= 30) return 1
  if (num >= 31 && num <= 45) return 2
  if (num >= 46 && num <= 60) return 3
  if (num >= 61 && num <= 75) return 4
  return -1
}

// Helper to get bingo prefix for audio file
function getBingoPrefix(number) {
  if (number >= 1 && number <= 15) return "b"
  if (number >= 16 && number <= 30) return "i"
  if (number >= 31 && number <= 45) return "n"
  if (number >= 46 && number <= 60) return "g"
  if (number >= 61 && number <= 75) return "o"
  return ""
}

function checkBingoWin(grid, calledNumbers, numberOfWinningPatterns) {
  if (!Array.isArray(grid) || grid.length !== 5 || calledNumbers.length === 0) return false

  const lastCalledNumber = calledNumbers[calledNumbers.length - 1]

  // Check if the last called number exists in the cartela
  let lastNumberExistsInCartela = false
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (grid[i][j] === lastCalledNumber) {
        lastNumberExistsInCartela = true
        break
      }
    }
    if (lastNumberExistsInCartela) break
  }

  if (!lastNumberExistsInCartela) return false

  // Get all winning patterns using the existing getWinningPattern function
  const allWinningPatterns = getWinningPattern(grid, calledNumbers)

  // Count patterns excluding 'nomarks' for numberOfWinningPatterns
  const nonNoMarksPatterns = allWinningPatterns.filter(pattern => pattern.type !== "nomarks").length

  // Special case for 'nomarks' pattern when numberOfWinningPatterns is 1
  if (numberOfWinningPatterns === 1) {
    // If any pattern is found (including nomarks), it's a win
    if (allWinningPatterns.length > 0) {
      // For non-nomarks patterns, ensure the last called number is part of the pattern
      if (nonNoMarksPatterns > 0) {
        for (const pattern of allWinningPatterns) {
          switch (pattern.type) {
            case "horizontal":
              if (grid[pattern.index].includes(lastCalledNumber)) return true
              break
            case "vertical":
              if ([0, 1, 2, 3, 4].some(rowIdx => grid[rowIdx][pattern.index] === lastCalledNumber)) return true
              break
            case "diagonal":
              if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => grid[i][i] === lastCalledNumber)) return true
              if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => grid[i][4 - i] === lastCalledNumber)) return true
              break
            case "corners":
              const corners = [[0, 0], [0, 4], [4, 0], [4, 4]] // Only outer corners
              if (corners.some(([i, j]) => grid[i][j] === lastCalledNumber)) return true
              break
          }
        }
      } else if (allWinningPatterns.some(pattern => pattern.type === "nomarks")) {
        // For nomarks, any number in the cartela can trigger the win
        return true
      }
    }
    return false
  }

  // For numberOfWinningPatterns >= 2, check if the number of non-nomarks patterns meets or exceeds the requirement
  if (numberOfWinningPatterns >= 2) {
    if (nonNoMarksPatterns >= numberOfWinningPatterns) {
      // Ensure the last called number is part of at least one of the winning patterns
      for (const pattern of allWinningPatterns) {
        if (pattern.type === "nomarks") continue // Skip nomarks for multi-pattern checks
        switch (pattern.type) {
          case "horizontal":
            if (grid[pattern.index].includes(lastCalledNumber)) return true
            break
          case "vertical":
            if ([0, 1, 2, 3, 4].some(rowIdx => grid[rowIdx][pattern.index] === lastCalledNumber)) return true
            break
          case "diagonal":
            if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => grid[i][i] === lastCalledNumber)) return true
            if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => grid[i][4 - i] === lastCalledNumber)) return true
            break
           case "corners":
            const corners = [[0, 0], [0, 4], [4, 0], [4, 4]] // Only outer corners
            if (corners.some(([i, j]) => grid[i][j] === lastCalledNumber)) return true
            break
        }
      }
    }
    return false
  }

  return false
}

function getWinningPattern(grid, calledNumbers) {
  if (!Array.isArray(grid) || grid.length !== 5) return []
  const foundPatterns = []

  // Check horizontal lines
  for (let i = 0; i < 5; i++) {
    if (
      grid[i].every(
        (val, j) => (val === "FREE" && i === 2 && j === 2) || (typeof val === "number" && calledNumbers.includes(val)),
      )
    ) {
      foundPatterns.push({ type: "horizontal", index: i })
    }
  }
  // Check vertical lines
  for (let i = 0; i < 5; i++) {
    if (
      [0, 1, 2, 3, 4].every((rowIdx) => {
        const cellValue = grid[rowIdx][i]
        return (
          (cellValue === "FREE" && rowIdx === 2 && i === 2) ||
          (typeof cellValue === "number" && calledNumbers.includes(cellValue))
        )
      })
    ) {
      foundPatterns.push({ type: "vertical", index: i })
    }
  }
  // Check main diagonal (top-left to bottom-right)
  if (
    [0, 1, 2, 3, 4].every(
      (i) =>
        (grid[i][i] === "FREE" && i === 2) || (typeof grid[i][i] === "number" && calledNumbers.includes(grid[i][i])),
    )
  ) {
    foundPatterns.push({ type: "diagonal", direction: "main" })
  }
  // Check anti-diagonal (top-right to bottom-left)
  if (
    [0, 1, 2, 3, 4].every(
      (i) =>
        (grid[i][4 - i] === "FREE" && i === 2) ||
        (typeof grid[i][4 - i] === "number" && calledNumbers.includes(grid[i][4 - i])),
    )
  ) {
    foundPatterns.push({ type: "diagonal", direction: "anti" })
  }
  // Check four outer corners
  const corners = [
    [0, 0],
    [0, 4],
    [4, 0],
    [4, 4],
  ]
  if (corners.every(([i, j]) => typeof grid[i][j] === "number" && calledNumbers.includes(grid[i][j]))) {
    foundPatterns.push({ type: "corners", pattern: "outer" })
  }
  
  // Check no green marks pattern
  let marked = 0
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) continue
      if (typeof grid[i][j] === "number" && calledNumbers.includes(grid[i][j])) marked++
    }
  }
  if (marked === 0 && calledNumbers.length >= 15) {
    foundPatterns.push({ type: "nomarks" })
  }
  return foundPatterns
}

function isCellInWinningPattern(rowIdx, colIdx, allWinningPatterns) {
  if (!allWinningPatterns || allWinningPatterns.length === 0) return false
  for (const pattern of allWinningPatterns) {
    switch (pattern.type) {
      case "horizontal":
        if (rowIdx === pattern.index) return true
        break
      case "vertical":
        if (colIdx === pattern.index) return true
        break
      case "diagonal":
        if (pattern.direction === "main" && rowIdx === colIdx) return true
        if (pattern.direction === "anti" && rowIdx === 4 - colIdx) return true
        break
      case "corners":
        if (
          (rowIdx === 0 && colIdx === 0) ||
          (rowIdx === 0 && colIdx === 4) ||
          (rowIdx === 4 && colIdx === 0) ||
          (rowIdx === 4 && colIdx === 4)
        )
          return true
        break
      case "nomarks":
        // Only the free space is part of the 'nomarks' pattern visually
        if (rowIdx === 2 && colIdx === 2) return true
        break
    }
  }
  return false
}

const Game = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [calledNumbers, setCalledNumbers] = useState([])
  const [lastFiveCalled, setLastFiveCalled] = useState([])
  const [currentNumber, setCurrentNumber] = useState(null)
  const { currentUser } = useSelector((state) => state.user)
  const [price, setPrice] = useState(null)
  const [recent, setRecent] = useState(null)
  const [allprice, setAllPrice] = useState(null)
  const [prizeInfo, setPrizeInfo] = useState(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [winAudioPlayed, setWinAudioPlayed] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(5)
  const [lockedNonWinners, setLockedNonWinners] = useState({})
  const [isShuffling, setIsShuffling] = useState(false)
  const [controlAudioLoaded, setControlAudioLoaded] = useState(false)
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0)
  const [allAudioLoaded, setAllAudioLoaded] = useState(false)
  const [gameSessionStarted, setGameSessionStarted] = useState(false)
  const [isSubmittingPrice, setIsSubmittingPrice] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [showOfflineStatus, setShowOfflineStatus] = useState(false)

  const calledNumbersRef = useRef([])
  const availableNumbersRef = useRef([])
  const audioRefs = useRef({})
  const controlAudioRefs = useRef({})

  useEffect(() => {
    availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1)
  }, [])

  useEffect(() => {
    calledNumbersRef.current = calledNumbers
    availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (num) => !calledNumbers.includes(num),
    )
    // Update last five called numbers with FIFO logic
    setLastFiveCalled((prev) => {
      const newList = [...prev, currentNumber].filter(num => num !== null)
      if (newList.length > 5) {
        return newList.slice(-5)
      }
      return newList
    })
  }, [calledNumbers, currentNumber])

  useEffect(() => {
    const preloadAudio = async () => {
      try {
        console.log("Starting priority audio preload...")
        const controlAudios = {
          play: "/images/Audio/bingo/p.mp3",
          continue: "/images/Audio/bingo/c.mp3",
          stop: "/images/Audio/bingo/s.mp3",
          shuffle: "/images/Audio/bingo/sh.mp3",
          winner: "/images/Audio/bingo/w.mp3",
          winnerclap: "/images/Audio/bingo/clap.mp3",
          try: "/images/Audio/bingo/t.mp3",
          notFound: "/images/Audio/bingo/n.mp3",
          pass: "/images/Audio/bingo/pass.mp3",
        }
        console.log("Loading control audios first...")
        const controlPromises = Object.entries(controlAudios).map(([key, path]) => {
          return new Promise((resolve) => {
            const audio = new Audio()
            audio.preload = "auto"
            audio.volume = 1.0
            const onReady = () => {
              controlAudioRefs.current[key] = audio
              console.log(`✅ Loaded control audio: ${key}`)
              resolve(true)
            }
            const onError = () => {
              console.warn(`❌ Failed to load control audio: ${key}`)
              controlAudioRefs.current[key] = audio
              resolve(false)
            }
            audio.addEventListener("canplaythrough", onReady, { once: true })
            audio.addEventListener("canplay", onReady, { once: true })
            audio.addEventListener("error", onError, { once: true })
            audio.src = path
            audio.load()
            setTimeout(() => {
              if (!controlAudioRefs.current[key]) {
                console.warn(`⏰ Timeout loading control audio: ${key}`)
                controlAudioRefs.current[key] = audio
                resolve(false)
              }
            }, 3000)
          })
        })
        const controlResults = await Promise.all(controlPromises)
        const controlSuccessCount = controlResults.filter(Boolean).length
        console.log(`🎮 Control audios loaded: ${controlSuccessCount}/${controlResults.length}`)
        setControlAudioLoaded(true)
        setAudioLoadingProgress(10)

        console.log("Loading number audios in background...")
        const numberPromises = []
        const totalNumbers = 75
        let loadedNumberCount = 0

        for (let i = 1; i <= totalNumbers; i++) {
          const prefix = getBingoPrefix(i)
          if (!prefix) {
            console.warn(`Skipping audio for number ${i}: No prefix found.`)
            continue
          }
          const filename = `${prefix}${i}.mp3`
          const audioPath = `/images/Audio/bingo/${filename}`

          const promise = new Promise((resolve) => {
            const audio = new Audio()
            audio.preload = "auto"
            audio.volume = 1.0
            const onReady = () => {
              audioRefs.current[i] = audio
              loadedNumberCount++
              const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
              setAudioLoadingProgress(Math.round(currentProgress))
              resolve(true)
            }
            const onError = () => {
              console.warn(`❌ Failed to load number audio: ${filename}`)
              audioRefs.current[i] = audio
              loadedNumberCount++
              const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
              setAudioLoadingProgress(Math.round(currentProgress))
              resolve(false)
            }
            audio.addEventListener("canplaythrough", onReady, { once: true })
            audio.addEventListener("canplay", onReady, { once: true })
            audio.addEventListener("error", onError, { once: true })
            audio.src = audioPath
            audio.load()
            setTimeout(() => {
              if (!audioRefs.current[i]) {
                console.warn(`⏰ Timeout loading number audio: ${filename}`)
                audioRefs.current[i] = audio
                loadedNumberCount++
                const currentProgress = 10 + (loadedNumberCount / totalNumbers) * 90
                setAudioLoadingProgress(Math.round(currentProgress))
                resolve(false)
              }
            }, 8000)
          })
          numberPromises.push(promise)
        }
        const numberResults = await Promise.all(numberPromises)
        const numberSuccessCount = numberResults.filter(Boolean).length
        console.log(`🔢 Number audios loaded: ${numberSuccessCount}/${numberResults.length}`)
        setAllAudioLoaded(true)
        setAudioLoadingProgress(100)
      } catch (error) {
        console.warn("Audio preloading error:", error)
        setControlAudioLoaded(true)
        setAllAudioLoaded(true)
        setAudioLoadingProgress(100)
      }
    }
    preloadAudio()
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
          audio.src = ""
        }
      })
      Object.values(controlAudioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
          audio.src = ""
        }
      })
    }
  }, [])

  const playControlAudio = (type) => {
    try {
      const audio = controlAudioRefs.current[type]
      if (audio) {
        audio.currentTime = 0
        if (audio.readyState >= 2) {
          const playPromise = audio.play()
          if (playPromise) {
            playPromise.catch((error) => {
              console.warn(`Failed to play control audio ${type}:`, error)
            })
          }
        } else {
          console.warn(`Control audio ${type} not ready, forcing load...`)
          audio.load()
          audio.addEventListener(
            "canplay",
            () => {
              audio.play().catch((error) => {
                console.warn(`Failed to play control audio ${type} after load:`, error)
              })
            },
            { once: true },
          )
        }
      } else {
        console.warn(`Control audio ${type} not found`)
      }
    } catch (error) {
      console.warn(`Error playing control audio ${type}:`, error)
    }
  }

  const playNumberAudio = (number) => {
    try {
      const audio = audioRefs.current[number]
      if (audio) {
        audio.currentTime = 0
        if (audio.readyState >= 2) {
          const playPromise = audio.play()
          if (playPromise) {
            playPromise.catch((error) => {
              console.warn(`Failed to play number audio ${number}:`, error)
            })
          }
        } else {
          console.warn(`Number audio ${number} not ready, forcing load...`)
          audio.load()
          audio.addEventListener(
            "canplay",
            () => {
              audio.play().catch((error) => {
                console.warn(`Failed to play number audio ${number} after load:`, error)
              })
            },
            { once: true },
          )
        }
      } else {
        console.warn(`Number audio ${number} not found`)
      }
    } catch (error) {
      console.warn(`Error playing number audio ${number}:`, error)
    }
  }

  let lastFoundInCartela = null
  if (searchResult?.cartela?.grid) {
    const cartelaNumbers = searchResult.cartela.grid.flat().filter((v) => typeof v === "number")
    for (let i = calledNumbers.length - 1; i >= 0; i--) {
      if (cartelaNumbers.includes(calledNumbers[i])) {
        lastFoundInCartela = calledNumbers[i]
        break
      }
    }
  }

  const generateNextNumber = () => {
    const available = availableNumbersRef.current
    const loadedAvailableNumbers = available.filter((num) => {
      const audio = audioRefs.current[num]
      return audio && audio.readyState >= 2
    })

    if (loadedAvailableNumbers.length === 0) {
      console.warn("No more numbers with loaded audio available to call.")
      if (isPlaying) {
        stopGame()
      }
      return null
    }

    const randomIndex = Math.floor(Math.random() * loadedAvailableNumbers.length)
    const nextNumber = loadedAvailableNumbers[randomIndex]
    console.log(`Generated number: ${nextNumber}, Available loaded count: ${loadedAvailableNumbers.length}`)

    playNumberAudio(nextNumber)

    setCurrentNumber(nextNumber)
    setCalledNumbers((prev) => {
      const newCalledNumbers = [...prev, nextNumber]
      console.log(`Updated called numbers: ${newCalledNumbers.length}/75`)
      return newCalledNumbers
    })
    calledNumbersRef.current = [...calledNumbersRef.current, nextNumber]
    availableNumbersRef.current = available.filter((num) => num !== nextNumber)
    return nextNumber
  }

  useEffect(() => {
    const handleOnline = () => {
      console.log("[v0] Internet connection restored - going online")
      setIsOnline(true)
      setShowOfflineStatus(false)
      console.log("[v0] Calling processPendingSubmissions after going online")
      processPendingSubmissions()
    }

    const handleOffline = () => {
      console.log("[v0] Internet connection lost - going offline")
      setIsOnline(false)
      setShowOfflineStatus(true)
    }

    const loadPendingSubmissions = () => {
      console.log("[v0] Loading pending submissions from localStorage")
      try {
        const stored = localStorage.getItem("pendingGameSubmissions")
        if (stored) {
          const pending = JSON.parse(stored)
          console.log("[v0] Found pending submissions:", pending.length)
          setPendingSubmissions(pending)
          if (pending.length > 0 && navigator.onLine) {
            console.log("[v0] Processing pending submissions on component mount")
            processPendingSubmissions()
          }
        } else {
          console.log("[v0] No pending submissions found in localStorage")
        }
      } catch (error) {
        console.error("[v0] Error loading pending submissions:", error)
      }
    }

    console.log("[v0] Setting up online/offline event listeners")
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    loadPendingSubmissions()

    return () => {
      console.log("[v0] Cleaning up online/offline event listeners")
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const processPendingSubmissions = async () => {
    console.log("[v0] processPendingSubmissions called")
    const stored = localStorage.getItem("pendingGameSubmissions")
    if (!stored) {
      console.log("[v0] No stored submissions found")
      return
    }

    try {
      const pending = JSON.parse(stored)
      if (pending.length === 0) {
        console.log("[v0] Pending submissions array is empty")
        return
      }

      console.log(`[v0] Processing ${pending.length} pending submissions...`)

      for (const submission of pending) {
        try {
          console.log("[v0] Submitting pending data:", submission.id)
          const res = await fetch("/api/price/allprice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission.data),
          })

          if (res.ok) {
            console.log("[v0] Successfully submitted pending data:", submission.id)
          } else {
            console.warn("[v0] Failed to submit pending data:", submission.id, res.status)
          }
        } catch (error) {
          console.warn("[v0] Error submitting pending data:", error)
        }
      }

      console.log("[v0] Clearing pending submissions from localStorage")
      localStorage.removeItem("pendingGameSubmissions")
      setPendingSubmissions([])
    } catch (error) {
      console.error("[v0] Error processing pending submissions:", error)
    }
  }

  const storePendingSubmission = (submissionData) => {
    console.log("[v0] Storing submission for offline processing")
    const submission = {
      id: Date.now() + Math.random(),
      data: submissionData,
      timestamp: new Date().toISOString(),
    }

    try {
      const existing = localStorage.getItem("pendingGameSubmissions")
      const pending = existing ? JSON.parse(existing) : []
      pending.push(submission)
      localStorage.setItem("pendingGameSubmissions", JSON.stringify(pending))
      setPendingSubmissions(pending)
      console.log("[v0] Stored submission for offline processing:", submission.id)
      console.log("[v0] Total pending submissions:", pending.length)
    } catch (error) {
      console.error("[v0] Error storing pending submission:", error)
    }
  }

  const startGame = async () => {
    if (isPlaying) return

    const isGameFinished = calledNumbers.length === 75
    const isInitialStart = calledNumbers.length === 0 && currentNumber === null

    if (isGameFinished || (isInitialStart && !gameSessionStarted)) {
      setCalledNumbers([])
      setCurrentNumber(null)
      calledNumbersRef.current = []
      availableNumbersRef.current = Array.from({ length: 75 }, (_, i) => i + 1)
      setLockedNonWinners({})
      setGameSessionStarted(false)
      setIsSubmittingPrice(false)
    }

    if (
      !gameSessionStarted &&
      !isSubmittingPrice &&
      price &&
      recent &&
      price.createdBy === currentUser._id &&
      recent.createdBy === currentUser._id &&
      prizeInfo &&
      recent.totalselectedcartela > 3
    ) {
      const today = new Date().toISOString().split("T")[0]
      const todaysRounds = Array.isArray(allprice)
        ? allprice.filter(
            (p) => p.createdBy === currentUser._id && new Date(p.createdAt).toISOString().split("T")[0] === today,
          )
        : []
      const lastRound = todaysRounds.length > 0 ? todaysRounds[todaysRounds.length - 1].round : 0

      console.log("lastRound:", lastRound)
      console.log("recent.round:", recent.round)
      console.log("Comparison (lastRound !== Number(recent.round)):", lastRound !== Number(recent.round))

      if (lastRound !== Number(recent.round)) {
        setIsSubmittingPrice(true)

        const submissionData = {
          createdBy: currentUser._id,
          Total: prizeInfo.total.toString(),
          WinnerPrize: prizeInfo.winnerPrize.toString(),
          HostingRent: prizeInfo.rentAmount.toString(),
          round: prizeInfo.round.toString(),
          winRemains: prizeInfo.winRemains.toString(),
        }

        if (!isOnline) {
          console.log("[v0] Submit from internet off - storing data offline")
          storePendingSubmission(submissionData)
          setGameSessionStarted(true)
          setIsSubmittingPrice(false)
          console.log("[v0] Stored submission offline - game can proceed")
        } else {
          console.log("[v0] Submit with internet on - attempting normal submission")
          try {
            const res = await fetch("/api/price/allprice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(submissionData),
            })
            const data = await res.json()
            if (res.ok && data.success) {
              setGameSessionStarted(true)
            }
          } catch (err) {
            console.warn("Error storing price:", err)
            storePendingSubmission(submissionData)
            setGameSessionStarted(true)
          } finally {
            setIsSubmittingPrice(false)
          }
        }
      }
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsPlaying(true)
    setTimeout(() => {
      playControlAudio(isInitialStart ? "play" : "continue")
    }, 0)

    timeoutRef.current = setTimeout(() => {
      const firstNumber = generateNextNumber()
      if (firstNumber === null) {
        stopGame()
        return
      }
      intervalRef.current = setInterval(() => {
        const num = generateNextNumber()
        if (num === null) {
          stopGame()
        }
      }, gameSpeed * 1000)
    }, 3000)
  }

  const stopGame = () => {
    playControlAudio("stop")
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleShuffle = () => {
    playControlAudio("shuffle")
    setIsShuffling(true)
    setTimeout(() => {
      setIsShuffling(false)
    }, 2700)
  }

  const updateGameSpeed = () => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        const num = generateNextNumber()
        if (num === null) {
          stopGame()
        }
      }, gameSpeed * 1000)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (currentNumber !== null) {
      setShowCurrent(true)
      const timeout = setTimeout(() => setShowCurrent(false), 2500)
      return () => clearTimeout(timeout)
    }
  }, [currentNumber])

  // useEffect(() => {
  //   if (!currentUser || !currentUser._id) return
  //   // fetch("/api/price/me")
  //   //   .then((res) => res.json())
  //   //   .then((data) => {
  //   //     if (data.success && data.data && data.data.createdBy === currentUser._id) {
  //   //       setPrice(data.data)
  //   //     }
  //   //   })
  //   fetch("/api/selectedcartelas/recent")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success && data.data && data.data.createdBy === currentUser._id) {
  //         setRecent(data.data)
  //       }
  //     })
  //   fetch("/api/price/allprice")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success && data.data && Array.isArray(data.data.byDay)) {
  //         setAllPrice(data.data.byDay)
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching allprice:", error)
  //     })
  // }, [currentUser])

  // useEffect(() => {
  //   if (price && recent && typeof recent.totalselectedcartela === "number") {
  //     console.log("this is the recent:", recent)
  //     const amount = Number(recent.price)
  //     const round = Number(recent.round)
  //     const rentpercent = Number(recent.rentpercent) / 100
  //     const numberOfSelectedCartelas = recent.totalselectedcartela
  //     const total = amount * numberOfSelectedCartelas
  //     let rentAmount = 0
  //     if (recent.totalselectedcartela > 3) {
  //       rentAmount = amount * rentpercent * numberOfSelectedCartelas
  //     }

  //     const winnerPrize = total - rentAmount
  //     const winRemains = winnerPrize % 10
  //     setPrizeInfo({ total, rentAmount, winnerPrize, round, winRemains })
  //   }
  // }, [price, recent])

  useEffect(() => {
  if (!currentUser?._id) {
    console.log("No current user ID, skipping fetch for recent cartela");
    return;
  }
  fetch(`/api/selectedcartelas/recent?userId=${currentUser._id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Raw response from /api/selectedcartelas/recent:", data); // Log raw API response
      if (data.success && data.data && data.data.createdBy === currentUser._id) {
        console.log("Setting recent data:", data.data); // Log data being set
        console.log("rentpercent value:", data.data.rentpercent, "Type:", typeof data.data.rentpercent); // Log rentpercent specifically
        setRecent(data.data);
      } else {
        console.log("Invalid response or user mismatch:", {
          success: data.success,
          hasData: !!data.data,
          createdByMatch: data.data?.createdBy === currentUser._id,
          data: data
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching recent cartela:", error);
    });
}, [currentUser]);

useEffect(() => {
  if (recent && typeof recent.totalselectedcartela === "number") {
    console.log("Processing recent in useEffect:", recent); // Log recent object
    console.log("rentpercent before processing:", recent.rentpercent, "Type:", typeof recent.rentpercent); // Log rentpercent
    const amount = Number(recent.price) || 0;
    const round = Number(recent.round) || 0;
    const rentpercent = Number(recent.rentpercent); // Fallback to 20
    console.log("Calculated rentpercent (after Number conversion):", rentpercent, "rentPercentDecimal:", rentpercent / 100); // Log calculated values
    const rentPercentDecimal = rentpercent / 100;
    const numberOfSelectedCartelas = recent.totalselectedcartela;
    const total = amount * numberOfSelectedCartelas;
    let rentAmount = 0;
    if (numberOfSelectedCartelas > 3) {
      rentAmount = amount * rentPercentDecimal * numberOfSelectedCartelas;
    }
    const winnerPrize = total - rentAmount;
    const winRemains = winnerPrize % 10;
    console.log("Prize info:", { total, rentAmount, winnerPrize, round, winRemains }); // Log final calculations
    setPrizeInfo({ total, rentAmount, winnerPrize, round, winRemains });
  } else {
    console.log("useEffect skipped due to invalid recent data:", {
      recentExists: !!recent,
      totalselectedcartelaType: typeof recent?.totalselectedcartela
    });
  }
}, [recent]);

  const handleCheck = async () => {
    setSearchResult(null)
    setShowPopup(false)
    setWinAudioPlayed(false)
    if (!searchValue.trim()) return

    const cartelaNumber = String(searchValue.trim())
    const allCartelas = Array.isArray(recent?.cartelas) ? recent.cartelas : []
    const foundCartelaObject = allCartelas.find((cartela) => String(cartela.cartelaNumber) === cartelaNumber)

    if (!foundCartelaObject) {
      setSearchResult({
        cartela: { cartelaNumber: cartelaNumber, grid: [] },
        isWinner: false,
        isLocked: false,
        notFound: true,
      })
      setShowPopup(true)
      return
    }

    const cartelaGrid = foundCartelaObject.grid

    if (lockedNonWinners[cartelaNumber]) {
      setSearchResult({
        cartela: { cartelaNumber: cartelaNumber, grid: cartelaGrid },
        isWinner: false,
        isLocked: true,
        notFound: false,
      })
      setShowPopup(true)
      return
    }

    // Use numberOfSelectedCartelas as the number of required winning patterns
    const numberOfWinningPatterns = recent?.numberofwinningpatterns || 1
    const isWinner = checkBingoWin(cartelaGrid, calledNumbers, numberOfWinningPatterns)
    const allWinningPatterns = getWinningPattern(cartelaGrid, calledNumbers)
    const nonNoMarksPatterns = allWinningPatterns.filter(pattern => pattern.type !== "nomarks").length
    const lastCalledNumber = calledNumbers[calledNumbers.length - 1]
    let isLastCalledInWinningPattern = false

    if (nonNoMarksPatterns >= numberOfWinningPatterns) {
      for (const pattern of allWinningPatterns) {
        if (pattern.type === "nomarks") {
          isLastCalledInWinningPattern = true
          break
        }
        switch (pattern.type) {
          case "horizontal":
            if (cartelaGrid[pattern.index].includes(lastCalledNumber)) {
              isLastCalledInWinningPattern = true
            }
            break
          case "vertical":
            if ([0, 1, 2, 3, 4].some(rowIdx => cartelaGrid[rowIdx][pattern.index] === lastCalledNumber)) {
              isLastCalledInWinningPattern = true
            }
            break
          case "diagonal":
            if (pattern.direction === "main" && [0, 1, 2, 3, 4].some(i => cartelaGrid[i][i] === lastCalledNumber)) {
              isLastCalledInWinningPattern = true
            }
            if (pattern.direction === "anti" && [0, 1, 2, 3, 4].some(i => cartelaGrid[i][4 - i] === lastCalledNumber)) {
              isLastCalledInWinningPattern = true
            }
            break
          case "corners":
            const corners = pattern.pattern === "outer" ? [[0, 0], [0, 4], [4, 0], [4, 4]] : [[1, 1], [1, 3], [3, 1], [3, 3]]
            if (corners.some(([i, j]) => cartelaGrid[i][j] === lastCalledNumber)) {
              isLastCalledInWinningPattern = true
            }
            break
        }
        if (isLastCalledInWinningPattern) break
      }
    }

    // Lock non-winning cartelas or those that missed the last call
    if (!isWinner || (nonNoMarksPatterns >= numberOfWinningPatterns && !isLastCalledInWinningPattern)) {
      setLockedNonWinners((prev) => ({
        ...prev,
        [cartelaNumber]: true,
      }))
    }

    setSearchResult({
      cartela: { cartelaNumber: cartelaNumber, grid: cartelaGrid },
      isWinner: isWinner,
      isLocked: !isWinner && lockedNonWinners[cartelaNumber],
      notFound: false,
      missedLastCall: nonNoMarksPatterns >= numberOfWinningPatterns && !isLastCalledInWinningPattern,
      insufficientPatterns: nonNoMarksPatterns < numberOfWinningPatterns,
    })
    setShowPopup(true)
  }

  useEffect(() => {
    if (!showPopup) setWinAudioPlayed(false)
  }, [showPopup])

  useEffect(() => {
    if (isPlaying) {
      updateGameSpeed()
    }
  }, [gameSpeed, isPlaying])

   const animationStyle = `
    @keyframes moveInFromBottomRight {
      0% { opacity: 0; transform: translate(120px, 120px) scale(0.2); }
      60% { opacity: 1; transform: translate(-10px, -10px) scale(1.1); }
      100% { opacity: 1; transform: translate(0, 0) scale(1); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.2; }
    }
    @keyframes flash-bw-colors {
      0% { background-color: #4b5563; }
      50% { background-color: #111827; }
      100% { background-color: #4b5563; }
    }
    @keyframes vibrate {
      0%, 100% { transform: translate(0); }
      10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
      20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
    }
    @keyframes zoomInOut {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
    @keyframes textBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .shuffle-effect {
      animation-name: flash-bw-colors;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      background-image: none !important;
      border-color: transparent !important;
      color: #22c55e !important;
    }
    .zoom-number {
      animation: zoomInOut 4s ease-in-out;
    }
    .blink-text {
      animation-name: textBlink;
      animation-timing-function: ease-in-out;
    }
  `
useEffect(() => {
  if (currentNumber !== null) {
    setShowCurrent(true)
    const timeout = setTimeout(() => setShowCurrent(false), 4000) // Changed from 2500 to 4000
    return () => clearTimeout(timeout)
  }
}, [currentNumber])

  return (
    <div className="min-h-screen bg-gray-900 text-white h-full flex flex-col justify-between  ">
      <div className="fixed top-4 right-4 z-40">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline ? "bg-green-600 text-white" : "bg-red-600 text-white animate-pulse"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-300" : "bg-red-300"}`}></div>
          {isOnline ? "Online" : "Offline"}
          {pendingSubmissions.length > 0 && (
            <span className="bg-black bg-opacity-30 px-2 py-0.5 rounded text-xs">{pendingSubmissions.length}</span>
          )}
        </div>
      </div>

      
      <style>{animationStyle}</style>
      
      <div className=" bg-gray-900 flex flex-col items-center justify-start py-0">
        <div className="flex flex-col rounded-3xl shadow-xl ">
          <div className="flex flex-col md:flex-row w-full md:w-auto bg-gray-800 rounded-md justify-center items-center mx-2 p-2">
            <div className="flex flex-row md:flex-col font-extrabold text-2xl md:text-4xl tracking-widest h-full w-full md:w-auto md:items-start p-2 gap-2">
              {bingoColumns.map((col) => (
                <button
                  key={col.letter}
                  className={`h-12 md:h-20 w-12 md:w-16 mb-0 rounded-md text-white shadow ${col.bg}`}
                  disabled
                >
                  {col.letter}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 md:gap-6 h-full w-full justify-center items-center p-2">
              {bingoColumns.map((col, colIdx) => (
                <div
                  key={col.letter}
                  className="flex flex-row items-center h-12 md:h-16 w-full flex-wrap md:flex-nowrap justify-center"
                >
                  {Array.from({ length: col.range[1] - col.range[0] + 1 }, (_, i) => {
                    const num = col.range[0] + i
                    const isCalled = calledNumbers.includes(num)
                     const isCurrent = num === currentNumber && showCurrent
                    return (
                      <button
                        key={num}
                        className={`h-12 md:h-[5.5rem] w-12 md:w-[4.75rem] mr-1 md:mr-2 rounded-lg md:rounded-md font-bold text-lg md:text-4xl shadow-md transition-all duration-150 ${
                          isShuffling
                            ? "shuffle-effect"
                            : isCalled
                              ? "text-white bg-gray-900 "
                              : "bg-gray-800 text-gray-700  border border-gray-700"
                        }`}
                        style={isShuffling ? { animationDelay: `${Math.random() * 2.6}s` } : {}}
                        disabled
                      >
                      <span
              className={isCurrent ? "blink-text" : ""}
              style={isCurrent ? { animationDuration: "1s", animationIterationCount: 5 } : {}}
            >
              {num}
            </span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
        <div className="w-full  mx-auto flex flex-col items-center px-2 bg-salt-900 mb-2  "> 
          <div className="flex justify-start items-start bg-salt-900 w-full px-32">
  <div className="flex flex-row items-center justify-center  rounded-3xl shadow-lg p-2 px-4  w-1/3 bg-gray-100">
    

    <div className="flex flex-row justify-center gap-2 min-h-[48px]">
      {lastFiveCalled.length === 0 ? (
        <p className="text-sm text-gray-600 self-center">No numbers</p>
      ) : (
        lastFiveCalled.map((num, index) => {
          const colIdx = getColumnIndex(num)
          const col = bingoColumns[colIdx]
          return (
            <div
              key={index}
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-lg text-white ${col.bg} border-2 border-fuchsia-300 shadow-md`}
            >
              {num}
            </div>
          )
        })
      )}
    </div>
  </div>
</div>


        <div className="flex flex-col md:flex-row items-end justify-center w-full md:w-[100%] lg:w-[100%] gap-8 py-2 px-10 bg-gray-900 md:mb-0 rounded-lg mx-auto shadow-lg h-[8.5rem]">
          
         
          
          <div className="flex-col flex-1 w-full max-w-md mx-auto border-b-4 border-gray-400 rounded-3xl shadow-lg p-4 bg-gray-700 ">
            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
              <button
                className="flex items-center gap-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                type="button"
                onClick={() => navigate("/play")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                End
              </button>
              <button
                className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed text-white ${
                  isPlaying ? "bg-red-500" : "bg-green-500"
                }`}
                type="button"
                onClick={isPlaying ? stopGame : startGame}
                disabled={!controlAudioLoaded}
              >
                {isPlaying ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    {controlAudioLoaded ? "Play" : "Loading..."}
                  </>
                )}
              </button>
              <button
                className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                type="button"
                onClick={handleShuffle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582l3.65-4.285A1 1 0 0110 5v14a1 1 0 01-1.768.64l-3.65-4.285H4v5h16V4H4z"
                  />
                </svg>
                Shuffle
              </button>
            </div>
            <div className="bg-gray-200 flex flex-row items-center justify-center w-full max-w-md p-1 rounded-2xl mt-2 shadow border border-yellow-200">
              <input
                type="text"
                placeholder="Search cartela number..."
                className="border-none outline-none rounded-lg h-9 p-2 w-full max-w-md text-fuchsia-800 placeholder-fuchsia-400 bg-transparent focus:ring-2 focus:ring-fuchsia-300 text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCheck()
                }}
              />
              <button
                className="flex items-center gap-1 bg-blue-500 text-white rounded-lg p-2 ml-2 shadow hover:bg-blue-600 transition text-xs h-8"
                onClick={handleCheck}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
                  />
                </svg>
                Check
              </button>
            </div>
          </div>
          {/* <div className="flex flex-1 flex-col items-center justify-center w-full mt-2  rounded-3xl shadow-lg p-2 border-2 border-gray-400">
            <p className="text-[28px] mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2">
              <span className="text-red-900">Progress</span>
              
            </p>
           
            <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2"> 
              <span className="text-white text-3xl font-black">{calledNumbers.length}</span>
              <span className="text-fuchsia-400 text-3xl font-black">/</span>
              <span className="text-yellow-500 text-3xl font-black">75</span> </p>
          </div> */}
          <div className="flex flex-1 flex-col items-center justify-center min-w-[500px] mt-2   p-4 ">
            <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold "> </p>
            <div className="flex flex-row justify-center gap-2 min-h-[48px]">
              {/* {lastFiveCalled.length === 0 ? (
                <p className="text-sm text-gray-600 self-center">No </p>
              ) : (
                lastFiveCalled.map((num, index) => {
                  const colIdx = getColumnIndex(num)
                  const col = bingoColumns[colIdx]
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${col.bg} border-2 border-fuchsia-300 shadow-md`}
                    >
                      {num}
                    </div>
                  )
                })
              )} */}
            </div>
          </div>
          <div className="flex flex-col items-center w-auto  gap-2  rounded-xl shadow-lg px-2 border-b-4 border-gray-300 bg-gray-800">
            <div className="flex flex-1 flex-col items-center justify-center w-full   rounded-3xl shadow-lg  border-b-4   border-gray-400">
            <p className="text-[28px] mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2">
              <span className="text-white">Progress</span>
              
            </p>
           
            <p className="text-xl mb-2 tracking-wide drop-shadow font-extrabold flex items-end gap-2"> 
              <span className="text-white text-3xl font-black">{calledNumbers.length}</span>
              <span className="text-fuchsia-400 text-3xl font-black">/</span>
              <span className="text-yellow-500 text-3xl font-black">75</span> </p>
          </div>
            <label className="text-sm font-semibold text-fuchsia-800">Speed: {gameSpeed}s</label>
            <div className="flex items-center gap-2 w-full max-w-xs">
              <span className="text-xs text-fuchsia-600 font-medium">1s</span>
              <input
                type="range"
                min="1"
                max="10"
                value={gameSpeed}
                onChange={(e) => setGameSpeed(Number(e.target.value))}
                disabled={isPlaying}
                className="flex-1 h-2 bg-gradient-to-r from-green-200 to-fuchsia-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fuchsia-500 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-fuchsia-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
              />
              <span className="text-xs text-fuchsia-600 font-medium">10s</span>
            </div>
            <p className="text-xs text-fuchsia-600 text-center">
              {isPlaying ? "" : ""}
            </p>
            
          </div>
          
          <div className="flex flex-1 flex-col items-center justify-center w-full mt-2  rounded-xl shadow-lg p-2 border-2 border-gray-300 gap-2 bg-gray-200">

            <p className="text-[16px]  tracking-wide drop-shadow font-extrabold flex  flex-col items-center">
              <span className="text-fuchsia-800 text-3xl"> {recent?.totalselectedcartela ?? 0} <span className="text-blue-600 text-[16px]">  Plyers</span> </span>
              <span className="text-green-700 text-3xl font-black"> <span className="text-red-600 text-[16px]"> by </span> 
                {recent ? recent.price : 0} <span className="text-red-600 text-[16px]">Birr</span>
              </span>
            </p>
            <div className="flex flex-row justify-center items-center gap-1">
              <p className="text-2xl font-bold text-fuchsia-700">Win</p>
            
            {prizeInfo && (
              <div className="flex items-end gap-1">
                <span className="text-6xl font-extrabold text-green-600">{Math.trunc(prizeInfo.winnerPrize)}</span>
                <span className="text-2xl font-bold text-fuchsia-500">Birr</span>
              </div>
            )}
            </div>

          </div>
        </div>
        </div>

        {showCurrent &&
          currentNumber !== null &&
          calledNumbers.length > 0 &&
          calledNumbers[calledNumbers.length - 1] === currentNumber && (
            <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
              <div
                className={`relative flex items-center justify-center w-[180px] h-[180px] md:w-[260px] md:h-[260px] border-4 border-fuchsia-400 rounded-full shadow-2xl ${bingoColumns[getColumnIndex(currentNumber)].bg} pointer-events-auto`}
              >
                <span
                  style={{
                    fontSize: "8rem",
                    fontWeight: 900,
                    animation: "moveInFromBottomRight 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  className="drop-shadow-lg text-white"
                >
                  {currentNumber}
                </span>
              </div>
            </div>
          )}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 border-2 border-gradient-to-r from-blue-300 to-purple-300">
              {searchResult?.notFound ? (
                <>
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-red-600 mb-2">Cartela Not Found</h2>
                      <p className="text-gray-600">The cartela number you searched for doesn't exist.</p>
                    </div>
                    {!winAudioPlayed &&
                      (() => {
                        playControlAudio("notFound")
                        setWinAudioPlayed(true)
                        return null
                      })()}
                    <button
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : searchResult?.isLocked ? (
                <>
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-10 h-10 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-orange-600 mb-2">Cartela Locked</h2>
                      <p className="text-gray-600 text-sm">
                        Cartela #{searchResult.cartela.cartelaNumber} was previously checked and is not a winner. It is
                        locked for this game.
                      </p>
                    </div>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold text-base shadow-md hover:from-orange-500 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                (() => {
                  const grid = searchResult.cartela.grid
                  const isWinner = searchResult.isWinner
                  const missedLastCall = searchResult.missedLastCall
                  const insufficientPatterns = searchResult.insufficientPatterns
                  const allWinningPatterns = isWinner ? getWinningPattern(grid, calledNumbers) : []

                  if (!winAudioPlayed) {
                    if (isWinner) {
                      const winnerAudio = new Audio("/images/Audio/bingo/w.mp3")
                      const clapAudio = new Audio("/images/Audio/bingo/clap.mp3")
                      winnerAudio.addEventListener("loadedmetadata", () => {
                        const timeToClap = Math.max((winnerAudio.duration - 0.5) * 1000, 0)
                        setTimeout(() => {
                          clapAudio.play()
                        }, timeToClap)
                      })
                      winnerAudio.play()
                    } else if (missedLastCall) {
                      playControlAudio("pass")
                    } else if (insufficientPatterns) {
                      playControlAudio("try")
                    } else {
                      playControlAudio("try")
                    }
                    setWinAudioPlayed(true)
                  }

                  return (
                    <>
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-3" >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isWinner
                                ? "bg-green-700"
                                : "bg-red-700"
                            }`}
                          >
                            {isWinner ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-900 bg-clip-text text-transparent">
                              Cartela {searchResult.cartela.cartelaNumber}
                            </h2>
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${isWinner ? "text-green-600" : "text-red-600"}`}>
                          {isWinner
                            ? "Congratulations! This cartela is a winner!"
                            : missedLastCall
                              ? "This cartela is missed"
                              : " does not have enough winning patterns."}
                        </div>
                      </div>
                      <div className="rounded-xl p-1 shadow-inner border border-gray-100">
                        <div className="flex justify-center mb-6 gap-2 ">
                          {bingoColumns.map((col, index) => (
                            <div
                              key={col.letter}
                              className={`w-20 h-16 bg-blue-900 flex items-center justify-center rounded-t-md font-bold text-2xl text-white shadow-sm ${index === 0 ? "rounded-tl-md" : ""} ${index === bingoColumns.length - 1 ? "rounded-tr-md" : ""}`}
                            >
                              {col.letter}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2">
                          {grid &&
                            grid.map((row, rowIdx) => (
                              <div key={rowIdx} className="flex gap-2 justify-center">
                                {row.map((val, colIdx) => {
                                  const isNum = typeof val === "number"
                                  const isCalled = isNum && calledNumbers.includes(val)
                                  const isLast = isNum && val === lastFoundInCartela
                                  const columnColor = bingoColumns[colIdx]
                                  const isInWinningPattern =
                                    isWinner && isCellInWinningPattern(rowIdx, colIdx, allWinningPatterns)
                                  return (
                                    <div
                                      key={colIdx}
                                      className={`w-20 h-16 flex items-center justify-center rounded-md font-semibold text-base border-2 transition-all duration-300 ${
                                        isNum
                                          ? isInWinningPattern
                                            ? "bg-green-600 text-white text-xl font-bold border-green-600 shadow-md transform scale-105 ring-1 ring-green-200"
                                            : isCalled
                                              ? "bg-yellow-400 text-white text-xl font-bold border-yellow-400 shadow-md transform scale-105"
                                              : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 text-xl font-bold border-gray-200 hover:shadow-sm"
                                          : isInWinningPattern
                                            ? "bg-gradient-to-br from-green-300 to-green-500 text-white border-green-600 font-bold text-sm ring-1 ring-green-200"
                                            : "bg-gradient-to-br from-yellow-300 to-orange-300 text-white border-yellow-400 font-bold text-sm"
                                      } ${isLast ? "ring-2 ring-pink-300 ring-opacity-75 animate-pulse" : ""}`}
                                    >
                                      {val === "FREE" ? <span className="text-xs font-bold">FREE</span> : val}
                                    </div>
                                  )
                                })}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <button
                          className="px-8 py-3 bg-red-700 text-white rounded-lg font-semibold text-base shadow-md hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          onClick={() => setShowPopup(false)}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )
                })()
              )}
            </div>
          </div>
        )}
      
      </div>
   
  )
}
export default Game