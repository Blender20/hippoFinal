import { homeIcon, saveIcon, smileIcon, tagIcon } from '../assets'
import Container from './Container'

const FooterTop = () => {
  const footers = [
    {
      image: homeIcon,
      title: 'High Quality Products',
      subTitle: 'Quality Control For Peace Of Mind',
    },
    {
      image: tagIcon,
      title: 'Affordable Prices',
      subTitle: 'Direct Prices. No Middle Man!',
    },
    {
      image: saveIcon,
      title: 'Express Shipping',
      subTitle: 'Fast, Reliable Delivery To meet deadline',
    },
    {
      image: smileIcon,
      title: 'Worry Free',
      subTitle: 'Instant Access To Professional Support',
    },
  ]
  return (
    <div className='bg-[#f7f7f7]'>
      <Container className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
        {footers?.map((item, index) => (
          <div
            key={item?.title}
            className={`flex items-start gap-3 mr-6 ${
              index !== footers.length - 1 ? 'lg:border-r border-gray-300' : ''
            }`}
          >
            <img src={item?.image} alt='image' className='w-12 h-12' />
            <div>
              <h3 className='text-lg font-bold'>{item?.title}</h3>
              <p className='text-sm text-gray-600 pr-6'>{item?.subTitle}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  )
}

export default FooterTop
