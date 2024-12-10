import React from 'react'

function Footer() {
  return (
    <footer className="footer footer-center bg-white border-t-2 text-base-content p-4 max-[639px]:mt-52 sm:mt-52 md:mt-0">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
    </footer>
  )
}

export default Footer