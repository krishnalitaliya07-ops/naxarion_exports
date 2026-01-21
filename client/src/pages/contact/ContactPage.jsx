import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  User,
  Building2,
  Tag,
  MessageCircle,
  Send,
  Globe,
  Clock,
  Share2,
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { submitContact } from '../../services/operations/contactAPI';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const onSubmit = async (data) => {
    try {
      const contactData = {
        ...data,
        newsletterOptIn
      };
      await submitContact(contactData);
      reset();
      setNewsletterOptIn(false);
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };
  const contactMethods = [
    {
      title: 'Email Us',
      description: 'Send us a detailed message and we\'ll respond within 2 hours',
      icon: Mail,
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-indigo-50 to-purple-100/60',
      border: 'border-indigo-200 hover:border-indigo-400',
      action: 'support@nexarion.com',
      actionType: 'mailto',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Call Us',
      description: 'Speak directly with our team Mon-Fri, 9AM-6PM EST',
      icon: Phone,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 to-teal-100/60',
      border: 'border-emerald-200 hover:border-emerald-400',
      action: '+1 (800) 123-4567',
      actionType: 'tel',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Live Chat',
      description: 'Get instant answers from our support team, available 24/7',
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'from-cyan-50 to-blue-100/60',
      border: 'border-cyan-200 hover:border-cyan-400',
      action: 'Start Chat',
      actionType: 'button',
      buttonGradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Book a Meeting',
      description: 'Schedule a personalized demo or consultation at your convenience',
      icon: Calendar,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50 to-orange-100/60',
      border: 'border-amber-200 hover:border-amber-400',
      action: 'Schedule Now',
      actionType: 'button',
      buttonGradient: 'from-amber-500 to-orange-600'
    }
  ];

  const offices = [
    { flag: '🇺🇸', name: 'United States (HQ)', address: '123 Business Avenue, Suite 500\nNew York, NY 10001\n📞 +1 (800) 123-4567' },
    { flag: '🇬🇧', name: 'United Kingdom', address: '45 Trade Street, Floor 3\nLondon, EC1A 1BB\n📞 +44 20 7123 4567' },
    { flag: '🇸🇬', name: 'Singapore', address: '88 Commerce Road, #12-05\nSingapore 048619\n📞 +65 6123 4567' }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  const socialMedia = [
    { name: 'Facebook', followers: '25K followers', icon: Facebook, gradient: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
    { name: 'Twitter', followers: '18K followers', icon: Twitter, gradient: 'from-sky-400 to-sky-500', hoverColor: 'hover:from-sky-500 hover:to-sky-600' },
    { name: 'Instagram', followers: '30K followers', icon: Instagram, gradient: 'from-pink-500 to-rose-600', hoverColor: 'hover:from-pink-600 hover:to-rose-700' },
    { name: 'LinkedIn', followers: '40K followers', icon: Linkedin, gradient: 'from-blue-600 to-blue-700', hoverColor: 'hover:from-blue-700 hover:to-blue-800' }
  ];

  const faqs = [
    {
      question: 'What are your response times?',
      answer: 'Email inquiries: 2-4 hours during business hours. Live chat: instant responses 24/7. Phone calls: immediate during business hours.',
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'from-white/90 to-indigo-50/60',
      border: 'border-indigo-200'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes! Our technical team handles platform issues, integrations, and troubleshooting. Use live chat for immediate help or email for detailed queries.',
      gradient: 'from-purple-500 to-pink-600',
      bg: 'from-white/90 to-purple-50/60',
      border: 'border-purple-200'
    },
    {
      question: 'Can I schedule a demo or consultation?',
      answer: 'Absolutely! Click "Book a Meeting" above or select "Sales & Pricing" in the contact form to schedule a personalized demo with our team.',
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'from-white/90 to-cyan-50/60',
      border: 'border-cyan-200'
    },
    {
      question: 'How can I become a partner?',
      answer: 'Email partnerships@nexarion.com or fill out the form selecting "Partnership Opportunities." We\'ll schedule a call to discuss collaboration.',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-white/90 to-emerald-50/60',
      border: 'border-emerald-200'
    },
    {
      question: 'Do you provide support in multiple languages?',
      answer: 'Yes! We offer support in English, Spanish, French, German, Mandarin, and 7+ other languages. Specify your preference when contacting us.',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-white/90 to-amber-50/60',
      border: 'border-amber-200'
    },
    {
      question: 'Can I visit your office without an appointment?',
      answer: 'We recommend scheduling ahead, but walk-ins are welcome during business hours. Call us first to ensure the right team member is available.',
      gradient: 'from-violet-500 to-fuchsia-600',
      bg: 'from-white/90 to-violet-50/60',
      border: 'border-violet-200'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full px-6 py-2 mb-6">
              <p className="font-bold text-xs uppercase tracking-wide">Get In Touch</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Let's Start a <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Conversation</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              We're here to help you succeed. Whether you have questions, need support, or want to explore partnership opportunities, our team is ready to assist you 24/7.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-1">{'< 2 Hours'}</p>
                <p className="text-sm text-slate-400">Average Response</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-1">24/7</p>
                <p className="text-sm text-slate-400">Live Chat Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-1">98%</p>
                <p className="text-sm text-slate-400">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Methods */}
      <div className="py-16 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Choose Your Preferred Contact Method</h2>
            <p className="text-sm text-slate-600">We're available through multiple channels for your convenience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="group relative">
                  <div className={`absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-br ${method.gradient.replace('to-', 'from-')} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                  
                  <div className={`relative bg-gradient-to-br ${method.bg} rounded-[25px] p-6 border-2 ${method.border} hover:shadow-2xl hover:-translate-y-2 transition-all text-center h-full`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">{method.title}</h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">{method.description}</p>
                    {method.actionType === 'mailto' || method.actionType === 'tel' ? (
                      <a href={`${method.actionType}:${method.action}`} className={`inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold ${method.textColor} hover:bg-white transition-all`}>
                        {method.action}
                      </a>
                    ) : (
                      <button className={`inline-block bg-gradient-to-r ${method.buttonGradient} text-white px-6 py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all`}>
                        {method.action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Contact Form & Info Section */}
      <div className="py-20 bg-gradient-to-r from-slate-50 to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Left Side - Contact Form */}
            <div className="lg:col-span-3 relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/95 to-indigo-50/70 backdrop-blur-sm rounded-[30px] p-10 border-2 border-indigo-200 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Send Us a Message</h2>
                  <p className="text-sm text-slate-600">Fill out the form and we'll respond within 24 hours. Fields marked with * are required.</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name & Company Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <User size={16} className="text-indigo-500" />
                        Full Name *
                      </label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        {...register('name', { required: 'Full name is required' })}
                        className={`w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Building2 size={16} className="text-indigo-500" />
                        Company Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Your Company Ltd." 
                        {...register('company')}
                        className="w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" 
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail size={16} className="text-indigo-500" />
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        placeholder="john@company.com" 
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className={`w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone size={16} className="text-indigo-500" />
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        {...register('phone')}
                        className="w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all" 
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Tag size={16} className="text-indigo-500" />
                      How can we help you? *
                    </label>
                    <select 
                      {...register('subject', { required: 'Please select a subject' })}
                      className={`w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 ${errors.subject ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all`}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Sales & Pricing">Sales & Pricing</option>
                      <option value="Partnership Opportunities">Partnership Opportunities</option>
                      <option value="Supplier Verification">Supplier Verification</option>
                      <option value="Payment Issues">Payment Issues</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <MessageCircle size={16} className="text-indigo-500" />
                      Your Message *
                    </label>
                    <textarea 
                      rows="6" 
                      placeholder="Tell us more about your inquiry or how we can help you..." 
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                      className={`w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border-2 ${errors.message ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-none`}
                    ></textarea>
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                    <p className="text-xs text-slate-500 mt-2">💡 Tip: Include as much detail as possible for a faster response</p>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="newsletter" 
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200" 
                    />
                    <label htmlFor="newsletter" className="text-xs text-slate-600 leading-relaxed">I'd like to receive updates, news, and special offers from Nexarion via email</label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-black text-base hover:shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-3">📧 You'll receive a confirmation email and we'll respond within 2-4 hours</p>
                </form>
              </div>
            </div>

            {/* Right Side - Additional Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Office Locations */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 blur-2xl"></div>
                
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-100/60 rounded-[25px] p-6 border-2 border-purple-200 shadow-lg">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">Global Offices</h3>
                      <p className="text-xs text-slate-600">Visit us in person</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-black text-slate-900 mb-2">{office.flag} {office.name}</p>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{office.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full opacity-20 blur-2xl"></div>
                
                <div className="relative bg-gradient-to-br from-cyan-50 to-blue-100/60 rounded-[25px] p-6 border-2 border-cyan-200 shadow-lg">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">Business Hours</h3>
                      <p className="text-xs text-slate-600">When we're available</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-200">
                        <span className="text-slate-700">{schedule.day}</span>
                        <span className="font-bold text-slate-900">{schedule.hours}</span>
                      </div>
                    ))}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-3 text-center">
                      <p className="text-sm text-white font-bold">💬 Live Chat: Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full opacity-20 blur-2xl"></div>
                
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-100/60 rounded-[25px] p-6 border-2 border-amber-200 shadow-lg">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <Share2 className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">Connect With Us</h3>
                      <p className="text-xs text-slate-600">Follow on social media</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {socialMedia.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a key={index} href="#" className={`bg-gradient-to-br ${social.gradient} ${social.hoverColor} rounded-xl p-4 flex items-center gap-3 shadow-md hover:shadow-xl hover:scale-105 transition-all group`}>
                          <IconComponent className="text-white" size={24} />
                          <div className="text-left">
                            <p className="text-xs font-bold text-white">{social.name}</p>
                            <p className="text-xs text-white/90">{social.followers}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Quick answers to common questions about contacting us</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {faqs.map((faq, index) => (
              <div key={index} className={`bg-gradient-to-br ${faq.bg} backdrop-blur-sm rounded-[20px] p-6 border-2 ${faq.border} hover:shadow-xl hover:-translate-y-1 transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${faq.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <HelpCircle className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 mb-2">{faq.question}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
