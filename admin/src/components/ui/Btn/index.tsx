import clsx from 'clsx'
import styles from './Btn.module.scss'

const Btn = () => {
  const customClass = clsx(styles.wrapper, '', {})

  return <button className={` ${customClass}`}>Button</button>
}

export default Btn
