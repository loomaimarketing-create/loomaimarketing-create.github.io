import { useEffect, useRef, useState } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CustomerInfo {
  name: string
  phone: string
  address: string
  date: string
  time: string
  comment: string
}

function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
      }
    }, { threshold: 0.1, ...options })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const { ref, isInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)'
      }}
    >
      {children}
    </div>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    comment: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Блокировка скролла при открытой корзине
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  const bouquets = [
    {
      id: 1,
      name: 'Тиффани',
      description: 'Элегантная композиция из 12 клубничных роз в молочном и белом шоколаде с бирюзовыми акцентами',
      price: 2900,
      roses: 12,
      gradient: 'from-[#9ecec5]/30 to-[#c5ddd8]/30',
      accent: 'text-[#7cb5aa]',
      hoverGlow: 'hover:shadow-[0_0_40px_rgba(156,206,197,0.3)]'
    },
    {
      id: 2,
      name: 'Розовая романтика',
      description: 'Нежный букет из 15 клубничных роз в розовом и белом бельгийском шоколаде',
      price: 3500,
      roses: 15,
      gradient: 'from-[#d4a5a5]/30 to-[#e8c4c4]/30',
      accent: 'text-[#c48888]',
      hoverGlow: 'hover:shadow-[0_0_40px_rgba(212,165,165,0.3)]'
    }
  ]

  const addToCart = (bouquet: typeof bouquets[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === bouquet.id)
      if (existing) {
        return prev.map(item => 
          item.id === bouquet.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { id: bouquet.id, name: bouquet.name, price: bouquet.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const openCart = () => {
    setIsCartOpen(true)
    setCheckoutStep(1)
  }

  const closeCart = () => {
    setIsCartOpen(false)
    setCheckoutStep(1)
  }

  const nextStep = () => {
    if (checkoutStep < 3) setCheckoutStep(checkoutStep + 1)
  }

  const prevStep = () => {
    if (checkoutStep > 1) setCheckoutStep(checkoutStep - 1)
  }

  const isStep2Valid = customerInfo.name && customerInfo.phone && customerInfo.address && customerInfo.date && customerInfo.time

  return (
    <div className="min-h-screen bg-[#3d3230] text-white overflow-x-hidden">
      {/* Animated Background Blobs - пастельные тёплые тона */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#d4a5a5]/20 rounded-full blur-[150px] animate-blob" />
        <div className="absolute top-[10%] right-[-15%] w-[550px] h-[550px] bg-[#c9b896]/20 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[#a89080]/25 rounded-full blur-[130px] animate-blob animation-delay-4000" />
        <div className="absolute top-[50%] right-[20%] w-[450px] h-[450px] bg-[#e8c4c4]/15 rounded-full blur-[120px] animate-blob animation-delay-3000" />
        <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-[#9ecec5]/15 rounded-full blur-[130px] animate-blob animation-delay-5000" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-[#dcc8b8]/20 rounded-full blur-[140px] animate-blob animation-delay-1000" />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} 
      />

      {/* Header с тремя элементами */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-3">
          {/* Кружок с корзиной - слева */}
          <button 
            onClick={openCart}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border border-[#d4a5a5]/20 hover:border-[#d4a5a5]/40 hover:scale-105 group ${
              scrolled 
                ? 'bg-[#4a3f3c]/70 backdrop-blur-2xl shadow-lg shadow-black/10' 
                : 'bg-[#4a3f3c]/50 backdrop-blur-xl'
            }`}
          >
            <svg className="w-5 h-5 text-[#e8c4c4] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#d4a5a5] to-[#c48888] rounded-full text-xs flex items-center justify-center text-white font-medium shadow-lg">
                {totalItems}
              </span>
            )}
          </button>

          {/* Основная шапка с логотипом - центр */}
          <header 
            className={`transition-all duration-500 ${
              scrolled 
                ? 'bg-[#4a3f3c]/70 backdrop-blur-2xl shadow-lg shadow-black/10' 
                : 'bg-[#4a3f3c]/50 backdrop-blur-xl'
            } rounded-full border border-[#d4a5a5]/20 px-6 py-2.5`}
          >
            <a href="#hero" className="group flex items-center gap-2">
              <span className="text-xl transition-all duration-300 group-hover:scale-110">🍓</span>
              <span className="font-serif text-lg tracking-wide text-[#f5e6e0] group-hover:text-white transition-colors duration-300">
                FlowBerry
              </span>
            </a>
          </header>

          {/* Кружок с чатом/Telegram - справа */}
          <a 
            href="https://t.me/YOUR_BOT_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border border-[#d4a5a5]/20 hover:border-[#d4a5a5]/40 hover:scale-105 group ${
              scrolled 
                ? 'bg-[#4a3f3c]/70 backdrop-blur-2xl shadow-lg shadow-black/10' 
                : 'bg-[#4a3f3c]/50 backdrop-blur-xl'
            }`}
          >
            <svg className="w-5 h-5 text-[#e8c4c4] group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[2rem] bg-[#3d3230]/95 border border-[#d4a5a5]/20 backdrop-blur-2xl shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-[#d4a5a5]/10">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#f5e6e0]">
                  {checkoutStep === 1 && 'Корзина'}
                  {checkoutStep === 2 && 'Контактные данные'}
                  {checkoutStep === 3 && 'Оплата'}
                </h2>
                <button 
                  onClick={closeCart}
                  className="w-10 h-10 rounded-full bg-[#4a3f3c]/60 flex items-center justify-center hover:bg-[#4a3f3c] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#e8c4c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center mt-6">
                {[
                  { num: 1, label: 'Заказ' },
                  { num: 2, label: 'Данные' },
                  { num: 3, label: 'Оплата' }
                ].map((step, index) => (
                  <div key={step.num} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                        step.num <= checkoutStep 
                          ? 'bg-gradient-to-br from-[#d4a5a5] to-[#c9a086] text-white' 
                          : 'bg-[#4a3f3c]/60 text-[#a89080]'
                      }`}>
                        {step.num < checkoutStep ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : step.num}
                      </div>
                      <span className={`text-xs mt-2 transition-colors duration-300 ${
                        step.num <= checkoutStep ? 'text-[#e8c4c4]' : 'text-[#a89080]'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-0.5 mx-3 mb-5 rounded transition-all duration-300 ${
                        step.num < checkoutStep ? 'bg-[#d4a5a5]' : 'bg-[#4a3f3c]/60'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Step 1: Cart Items */}
              {checkoutStep === 1 && (
                <div>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4a3f3c]/60 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#a89080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-[#a89080] mb-4">Корзина пуста</p>
                      <button 
                        onClick={closeCart}
                        className="px-6 py-2 rounded-full border border-[#d4a5a5]/30 text-[#e8c4c4] text-sm hover:bg-[#d4a5a5]/10 transition-colors"
                      >
                        Перейти в каталог
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#4a3f3c]/40 border border-[#d4a5a5]/10">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#d4a5a5]/30 to-[#c9b896]/30 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🌹</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[#f5e6e0] font-medium">{item.name}</h4>
                            <p className="text-[#c9b896] text-sm">{item.price.toLocaleString('ru-RU')} ₽</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-[#4a3f3c]/60 flex items-center justify-center hover:bg-[#4a3f3c] transition-colors text-[#e8c4c4]"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[#f5e6e0]">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-[#4a3f3c]/60 flex items-center justify-center hover:bg-[#4a3f3c] transition-colors text-[#e8c4c4]"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors text-[#a89080] hover:text-red-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Contact Info */}
              {checkoutStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#c9b896] mb-2">Ваше имя *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Как к вам обращаться"
                      className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] placeholder-[#a89080] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#c9b896] mb-2">Телефон *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] placeholder-[#a89080] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#c9b896] mb-2">Адрес доставки *</label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="Улица, дом, квартира"
                      className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] placeholder-[#a89080] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#c9b896] mb-2">Дата доставки *</label>
                      <input
                        type="date"
                        value={customerInfo.date}
                        onChange={(e) => setCustomerInfo({...customerInfo, date: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#c9b896] mb-2">Время *</label>
                      <input
                        type="time"
                        value={customerInfo.time}
                        onChange={(e) => setCustomerInfo({...customerInfo, time: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#c9b896] mb-2">Комментарий к заказу</label>
                    <textarea
                      value={customerInfo.comment}
                      onChange={(e) => setCustomerInfo({...customerInfo, comment: e.target.value})}
                      placeholder="Дополнительные пожелания..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[#4a3f3c]/60 border border-[#d4a5a5]/20 text-[#f5e6e0] placeholder-[#a89080] focus:outline-none focus:border-[#d4a5a5]/40 transition-colors resize-none"
                    />
                  </div>
                  <p className="text-xs text-[#a89080]">
                    * Обязательные поля. Минимальное время предзаказа — 2 часа.
                  </p>
                </div>
              )}

              {/* Step 3: Payment */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="p-4 rounded-2xl bg-[#4a3f3c]/40 border border-[#d4a5a5]/10">
                    <h4 className="text-sm text-[#c9b896] mb-3">Ваш заказ</h4>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-2">
                        <span className="text-[#f5e6e0]">{item.name} × {item.quantity}</span>
                        <span className="text-[#c9b896]">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    ))}
                    <div className="border-t border-[#d4a5a5]/10 mt-3 pt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#a89080]">Доставка</span>
                        <span className="text-[#a89080]">Рассчитывается отдельно</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-4 rounded-2xl bg-[#4a3f3c]/40 border border-[#d4a5a5]/10">
                    <h4 className="text-sm text-[#c9b896] mb-3">Доставка</h4>
                    <p className="text-[#f5e6e0] text-sm">{customerInfo.name}</p>
                    <p className="text-[#a89080] text-sm">{customerInfo.phone}</p>
                    <p className="text-[#a89080] text-sm">{customerInfo.address}</p>
                    <p className="text-[#a89080] text-sm">{customerInfo.date} в {customerInfo.time}</p>
                    {customerInfo.comment && (
                      <p className="text-[#a89080] text-sm mt-2 italic">«{customerInfo.comment}»</p>
                    )}
                  </div>

                  {/* Payment Methods Placeholder */}
                  <div className="p-6 rounded-2xl bg-[#4a3f3c]/40 border border-dashed border-[#d4a5a5]/30 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4a5a5]/30 to-[#c9b896]/30 flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#e8c4c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h4 className="text-[#f5e6e0] font-medium mb-2">Интеграция оплаты</h4>
                    <p className="text-[#a89080] text-sm mb-4">
                      Здесь будет интеграция с платёжной системой (ЮKassa, Stripe, Тинькофф и др.)
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Visa', 'Mastercard', 'МИР', 'СБП'].map((method) => (
                        <span key={method} className="px-3 py-1 rounded-full bg-[#4a3f3c]/60 text-xs text-[#c9b896]">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#d4a5a5]/10">
              {/* Total */}
              {cart.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#a89080]">Итого:</span>
                  <span className="text-2xl font-light text-[#f5e6e0]">
                    {totalPrice.toLocaleString('ru-RU')} <span className="text-lg text-[#c9b896]">₽</span>
                  </span>
                </div>
              )}
              
              {/* Buttons */}
              <div className="flex gap-3">
                {checkoutStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 rounded-full border border-[#d4a5a5]/30 text-[#e8c4c4] hover:bg-[#d4a5a5]/10 transition-colors"
                  >
                    Назад
                  </button>
                )}
                
                {checkoutStep < 3 && cart.length > 0 && (
                  <button
                    onClick={nextStep}
                    disabled={checkoutStep === 2 && !isStep2Valid}
                    className={`flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4a5a5] to-[#c9a086] text-white font-medium transition-all duration-300 ${
                      checkoutStep === 2 && !isStep2Valid 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-[0_0_30px_rgba(212,165,165,0.4)] hover:scale-[1.02]'
                    }`}
                  >
                    Далее
                  </button>
                )}

                {checkoutStep === 3 && (
                  <button
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4a5a5] to-[#c9a086] text-white font-medium hover:shadow-[0_0_30px_rgba(212,165,165,0.4)] hover:scale-[1.02] transition-all duration-300"
                  >
                    Оплатить {totalPrice.toLocaleString('ru-RU')} ₽
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedSection delay={0}>
            <div className="inline-block mb-6 px-5 py-2 rounded-full bg-[#4a3f3c]/40 border border-[#d4a5a5]/20 backdrop-blur-sm">
              <span className="text-sm text-[#e8c4c4] tracking-widest uppercase">Сладкая роскошь</span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light mb-8 leading-[0.9]">
              <span className="bg-gradient-to-r from-[#e8c4c4] via-[#f5e6e0] to-[#c5ddd8] bg-clip-text text-transparent">
                Букеты из клубники
              </span>
              <br />
              <span className="text-[#f5e6e0]/90">в шоколаде</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={400}>
            <p className="text-lg md:text-xl text-[#c9b896] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Создаём изысканные букеты из свежей клубники в форме роз, 
              покрытые бельгийским шоколадом. Каждый букет — произведение искусства.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#catalog" 
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#d4a5a5] to-[#c9a086] text-white font-medium tracking-wide hover:shadow-[0_0_40px_rgba(212,165,165,0.4)] transition-all duration-500 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Смотреть букеты
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <button 
                onClick={openCart}
                className="px-8 py-4 rounded-full border border-[#d4a5a5]/30 text-[#f5e6e0]/80 hover:bg-[#d4a5a5]/10 hover:border-[#d4a5a5]/50 transition-all duration-300"
              >
                Открыть корзину
              </button>
            </div>
          </AnimatedSection>

          {/* Scroll indicator */}
          <AnimatedSection delay={800}>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-[#d4a5a5]/30 flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-[#d4a5a5]/50 rounded-full animate-pulse" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <span className="text-sm text-[#c48888] tracking-widest uppercase mb-4 block">Коллекция</span>
              <h3 className="font-serif text-4xl md:text-5xl font-light text-[#f5e6e0] mb-4">Наши букеты</h3>
              <p className="text-[#a89080] max-w-md mx-auto">Два уникальных букета, созданных с любовью и вниманием к деталям</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {bouquets.map((bouquet, index) => (
              <AnimatedSection key={bouquet.id} delay={index * 200}>
                <div className={`group relative h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${bouquet.gradient} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className={`relative h-full p-8 md:p-10 rounded-[2rem] bg-[#4a3f3c]/40 border border-[#d4a5a5]/10 backdrop-blur-xl hover:bg-[#4a3f3c]/60 hover:border-[#d4a5a5]/25 transition-all duration-500 ${bouquet.hoverGlow}`}>
                    
                    {/* Decorative corner */}
                    <div className={`absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br ${bouquet.gradient} blur-2xl opacity-60`} />
                    
                    <div className="relative">
                      <span className={`text-xs tracking-widest uppercase ${bouquet.accent} mb-4 block`}>
                        {bouquet.roses} роз
                      </span>
                      
                      <h4 className="font-serif text-3xl md:text-4xl text-[#f5e6e0] mb-4 group-hover:text-white transition-all duration-500">
                        {bouquet.name}
                      </h4>
                      
                      <p className="text-[#a89080] leading-relaxed mb-8 text-sm md:text-base group-hover:text-[#c9b896] transition-colors duration-300">
                        {bouquet.description}
                      </p>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[#a89080] text-sm">Стоимость</span>
                          <p className="text-3xl font-light text-[#f5e6e0]">
                            {bouquet.price.toLocaleString('ru-RU')}
                            <span className="text-lg text-[#c9b896] ml-1">₽</span>
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => addToCart(bouquet)}
                          className="px-6 py-3 rounded-full border border-[#d4a5a5]/25 text-sm text-[#e8c4c4] hover:bg-[#d4a5a5]/20 hover:border-[#d4a5a5]/40 hover:text-white transition-all duration-300 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="p-10 md:p-16 rounded-[2.5rem] bg-[#4a3f3c]/40 border border-[#d4a5a5]/10 backdrop-blur-xl">
              <div className="grid md:grid-cols-3 gap-10 md:gap-16">
                {[
                  {
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: 'Предзаказ за 2 часа',
                    description: 'Минимальное время для создания вашего идеального букета',
                    color: 'from-[#9ecec5] to-[#7cb5aa]'
                  },
                  {
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    title: 'Доставка по Перми',
                    description: 'Стоимость доставки рассчитывается отдельно',
                    color: 'from-[#d4a5a5] to-[#c48888]'
                  },
                  {
                    icon: (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ),
                    title: 'Ручная работа',
                    description: 'Каждая клубничная роза создаётся вручную с любовью',
                    color: 'from-[#c9b896] to-[#a89080]'
                  }
                ].map((feature, index) => (
                  <AnimatedSection key={index} delay={index * 150}>
                    <div className="text-center group">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,165,165,0.2)] transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      <h4 className="text-lg font-medium text-[#f5e6e0] mb-2">{feature.title}</h4>
                      <p className="text-[#a89080] text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center">
              <span className="text-sm text-[#9ecec5] tracking-widest uppercase mb-4 block">О нас</span>
              <h3 className="font-serif text-4xl md:text-5xl font-light text-[#f5e6e0] mb-8">FlowBerry</h3>
              <div className="space-y-6 text-[#c9b896] leading-relaxed">
                <p className="text-lg">
                  Мы создаём не просто букеты — мы создаём эмоции. Каждая клубничная роза 
                  вырезается вручную и покрывается премиальным бельгийским шоколадом.
                </p>
                <p>
                  Наши букеты идеальны для романтических свиданий, юбилеев, дней рождения 
                  или просто для того, чтобы сделать обычный день особенным.
                </p>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-8 text-center">
                {[
                  { value: '500+', label: 'Букетов создано' },
                  { value: '100%', label: 'Свежие ягоды' },
                  { value: '2ч', label: 'Быстрый заказ' }
                ].map((stat, index) => (
                  <AnimatedSection key={index} delay={index * 100}>
                    <div className="group">
                      <div className="text-3xl font-light text-[#f5e6e0] group-hover:text-[#e8c4c4] transition-all duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xs text-[#a89080] uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="relative p-10 md:p-16 rounded-[2.5rem] overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4a5a5]/20 via-[#c9b896]/10 to-[#9ecec5]/20 animate-gradient" />
              <div className="absolute inset-0 bg-[#4a3f3c]/60 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-[#d4a5a5]/15 rounded-[2.5rem]" />
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a5a5] to-[#c9a086] mb-8 animate-pulse shadow-lg shadow-[#d4a5a5]/30">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                
                <h3 className="font-serif text-3xl md:text-4xl font-light text-[#f5e6e0] mb-4">
                  Готовы сделать заказ?
                </h3>
                <p className="text-[#c9b896] mb-10 max-w-md mx-auto">
                  Напишите нам в Telegram — мы поможем выбрать идеальный букет и оформим доставку
                </p>
                
                <a 
                  href="https://t.me/YOUR_BOT_USERNAME" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d4a5a5] to-[#c9a086] text-white font-medium text-sm tracking-wide hover:shadow-[0_0_35px_rgba(212,165,165,0.4)] hover:scale-105 transition-all duration-500"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Написать в Telegram
                </a>
                
                <p className="text-[#a89080] text-sm mt-8">
                  Отвечаем в течение 15 минут с 9:00 до 21:00
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="py-6 px-8 rounded-[2rem] bg-[#4a3f3c]/40 border border-[#d4a5a5]/10 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3">
              <span className="font-serif text-xl bg-gradient-to-r from-[#e8c4c4] to-[#c5ddd8] bg-clip-text text-transparent">
                FlowBerry
              </span>
              <span className="text-[#a89080]/30">•</span>
              <span className="text-[#a89080] text-sm">Пермь</span>
              <span className="text-[#a89080]/30">•</span>
              <span className="text-[#a89080]/70 text-sm">© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
