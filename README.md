# FED_ASG2_MokeSell
By: Aidan & Zixian
NOTE: anything that makes a request to RestDB does not work and ONLY works locally as it requires
      the CORS Proxy Server to make requests only way to test is to clone the project and test locally.
      
Click here to visit the website hosted on github: [Here](https://zhuang-zixian.github.io/FED_ASG2_MokeSell/)

---

## 📖 **About MokeSell**
**MokeSell** is an online marketplace for users to **buy and sell second-hand items** in various categories like **clothes, electronics, toys, and accessories**.  
The platform allows sellers to list items, and buyers to browse, view, and purchase.

---

## 📋 **How to Use**
1. Clone this repository:
   ```bash
   git clone https://github.com/Zhuang-Zixian/FED_ASG2_MokeSell.git
   ```

### Install dependencies:
2. Ensure you have [Node.js](https://nodejs.org/) installed. Then run:
   ```bash
   npm install
   ```

### Run the development server:
3. Start the CORS local proxy server to securely send data to RestDB:
   ```bash
   node cors-server.js
   ```
   
   Ensure you see something like this: CORS Proxy server is running on http://localhost:5000

### Run the development server:
4. Start the Vite development server locally:
   ```bash
   npm run dev
   ```

### Access the application:
Once the development server starts, Vite will display a local server URL (e.g., `http://localhost:5173`). Open the link in your web browser to view the application.

---

## 🖼️ **Wireframe Design**
The wireframe and UI design layout for MokeSell was created using **Figma**.

🎨 **View the Wireframe here**:  
[![Figma Wireframe](https://img.shields.io/badge/View%20on-Figma-blue?logo=figma&style=for-the-badge)](https://www.figma.com/design/3We6d1khHEPLA6EZ42fXRt/FED-Assignment-2-WireFrame?node-id=0-1&t=ngPHdBUqyLdej64r-1)

---

## 🎯 **Features**
### 🛒 **Product Listings**
- Users can **browse** and **view** available products by category.
- Each product displays:
  - High-quality **images**
  - **Price**, **condition**, and **seller information**
  - **Description** of the item

### 🔐 **User Authentication**
- **Signup & Login** features using **RestDB** as the backend database.
- Secure **password hashing** for user credentials.
- User sessions handled via a **CORS Proxy Server**.

### 🎡 **Lucky Spin Wheel**
- Users can **spin the wheel** once per day for a **discount voucher**.
- Randomized rewards **enhance user engagement**.

### ✉️ **Contact Form**
- Users can **submit inquiries** via a simple form.
- Integrated with **Formspree API** for handling submissions.
- Auto-close **thank you popup** after successful submission.

### 📌 **Interactive UI Enhancements**
- **Lottie animations** for smooth visual effects.
- **Bootstrap components** for improved responsiveness.
- **Google Maps API** displaying MokeSell’s business location.

---

## 🛠️ **Technologies Used**
| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure & Semantic Markup |
| **CSS3** | Styling & Responsive Design |
| **JavaScript (ES6+)** | Dynamic Interactions & API Handling |
| **Bootstrap 5** | Responsive UI Components |
| **Node.js** | Backend (CORS proxy server) |
| **RestDB** | NoSQL Database for storing users & products |
| **Vite** | Development Server for frontend |
| **Google Fonts (Poppins)** | Typography |

---

## 🔗 **APIs Used**
| API | Purpose |
|------|---------|
| **RestDB** | Stores user accounts & product listings |
| **MailJet API** | Handles Newsletter signups |
| **Formspree** | Handles contact form submissions |
| **DuckDuckGo API** | Used for the chatbot |

---

## 🙌 **Acknowledgements**
This project incorporates resources and inspiration from various sources. We extend our gratitude to the following:

### 🎨 **Lottie Animations**
The following **Lottie animations** were used in MokeSell:
- [Blue Dotted Progress](https://lottiefiles.com/free-animation/blue-dotted-progress-R0un5yINGE)
- [Online Shopping & Delivery](https://lottiefiles.com/free-animation/online-shopping-and-delivery-7TQ6Fy4ExY)
- [Online Shop](https://lottiefiles.com/free-animation/online-shop-96vHPmDvHA)
- [Shopping Animation](https://lottiefiles.com/free-animation/shopping-au9qUZUhPN)
- [Lottery Spin The Wheel](https://lottiefiles.com/free-animation/lottery-spin-the-wheel-4EqGMvarnE?color-palette=true)

---

### 🎨 **Canva Designed Graphics**
MokeSell UI elements and assets were designed using **Canva**:
- [Primary Canva Design](https://www.canva.com/design/DAGcXi6nX5s/_-4ERL2OyfDWWIa_SUxPGg/edit?utm_content=DAGcXi6nX5s&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- [Additional Canva Assets](https://www.canva.com/design/DAGdXniCVKQ/HRxn3oG4NAAsqSGRI0RsFw/edit?utm_content=DAGdXniCVKQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

### 🖼️ **Image Resources**
Some images used on MokeSell were sourced from various platforms:
- [Visa POS Guidelines](https://www.visa.com.sg/run-your-business/accept-visa-payments/posguidelines.html)
- [Mastercard Branding](https://elixirbrandcomm.com/Unbox/2019/March/mastercard-unbox.html)
- [SingPost Logo](https://www.behance.net/search/projects/singpost)
- [DHL Logo](https://freebiesupply.com/logos/dhl-logo/)
- [Carousell Marketplace](https://www.carousell.sg/)
- [Beats Studio3 Wireless Headphones](https://www.switch.sg/shop/Beats-Studio3-Wireless-Over-Ear-Headphones)
- [Amazon Product Image](https://m.media-amazon.com/images/I/513lmK8mqKL._AC_SY695_.jpg)
- [Profile Placeholder Icon](https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#fromView=keyword&page=1&position=1&uuid=a2eb4e8e-9ea0-47bb-b7c2-8c4f7a9a63d8&query=Profile+Placeholder)
- [Patek Philippe Nautilus 40th Anniversary Watch](https://www.ubuy.com.sg/product/1PJXT6QAK-patek-philippe-nautilus-40th-anniversary-limited-edition-18k-white-gold-watch-5976-1g-001)
- [Mega Space Molly 400% Sanrio Characters](https://www.popmart.com/sg/products/1455/mega-space-molly-400-sanrio-characters-series)
- [Double Floral Ring](https://chromeworld.jp/product/double-floral-ring)

---

### 🎨 **Adobe Color Palette**
MokeSell's **color scheme** was inspired by **Adobe Color Trends**:
- [Adobe Color Trends](https://color.adobe.com/trends#)


