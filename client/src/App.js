import './App.css';
import { createProduct, readProducts, updateProduct, deleteProduct } from './firebaseOperations.js'
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [operation, setOperation] = useState({
    create: false,
    update: false
  })
  const [products, setProducts] = useState([]);
  const [updatedProductID, setUpdatedProductID] = useState(undefined);

  const newProduct = useRef('');
  const updatedProduct = useRef('');

  useEffect(() => {
    handleReadProducts();
  }, [])

  const toggleOperation = (operationMode) => {
    console.log("Toggle called on: ", operation)
    switch (operationMode) {
      case 'create':
        if (!operation.create) {
          newProduct.current = '';
        }
        // setOperation({ ...operation, create: !operation.create });
        setOperation({ update: false, create: !operation.create });
        break;

      case 'update':
        if (!operation.update) {
          newProduct.current = '';
        }
        // setOperation({ ...operation, update: !operation.update });
        setOperation({ create: false, update: !operation.update });
        break;

      default:
        setOperation({
          update: !operation.update, create: !operation.create
        });

    }
  }

  const handleReadProducts = () => {
    readProducts(setProducts);
  }

  const handleCreateProduct = () => {
    try {
      toggleOperation('create');
      console.log(newProduct.current.value)
      const product = JSON.parse(`${newProduct.current.value}`);
      createProduct({ product });
      handleReadProducts();
      toast("Created product!")
      toggleOperation('create');
    }
    catch (err) {
      toast("Error!");
      console.log(err)
    }
  }

  const handleDeleteProduct = (productId) => {
    if (!productId) {
      toast("Error! Please select a valid product.");
      return;
    }
    deleteProduct({ productId });
    toast("Deleted product!");
    handleReadProducts();
  }

  const handleRestorePreviousProductInfo = (e) => {
    e.preventDefault();
    if (!updatedProductID) {
      toast("Error! Please select a product to be updated.")
      return;
    }
    const selectedProduct = products.filter(product => product.id === updatedProductID)[0];
    delete selectedProduct.id;
    updatedProduct.current.value = JSON.stringify(selectedProduct);
  }

  const handleUpdateProduct = (product) => {
    // updateProduct({ productId, product });
    try {
      console.log("Updated product is: ", updatedProduct)
      updateProduct({ productId: updatedProductID, product: JSON.parse(updatedProduct.current.value) });
      toggleOperation('update');
      handleReadProducts();
      toast("Product updated!")
    }
    catch (err) {
      toast("Error!");
      console.log(err)
    }
  }

  const getRecursiveSummary = (key, value) => {
    if (typeof value === 'object') {
      return (
        <details>
          <summary>{key}</summary>
          {
            Object.keys(value).map(subKey =>
              getRecursiveSummary(subKey, value[subKey]))
          }
        </details>
      )
    }

    else {
      return <div>{key}: {value}</div>
    }
  }

  return (
    <div className="App">
      {(operation.create || operation.update) &&
        <div>
          {operation.create && <input type="text" ref={newProduct} placeholder="Enter stringified product data." />}
          {operation.update && <input type="text" ref={updatedProduct} placeholder="Enter stringified product data." />}
          <button onClick={(e) => {
            if (operation.create) {
              toggleOperation('create');
            }
            if (operation.update) {
              toggleOperation('update');
              setUpdatedProductID(undefined);
            }
          }}>Cancel</button>
          {operation.create && <button onClick={handleCreateProduct}>Add</button>}
          {operation.update &&
            <>
              <button onClick={handleRestorePreviousProductInfo}>Restore product info</button>
              <button onClick={handleUpdateProduct}>Update</button>
            </>
          }
        </div>
      }
      <button onClick={(e) => toggleOperation('create')}>
        Create product
      </button>
      <button onClick={handleReadProducts}>
        Read all products
      </button>
      <ul>
        {products.length > 0 && products.map(product => {
          return (
            <li>
              {Object.keys(product).map(key => {
                if (typeof product[key] === 'object') {
                  return getRecursiveSummary(key, product[key]);
                }
                else {
                  return <div>{key} : {product[key]}</div>
                }
              })}
              <button onClick={(e) => {
                toggleOperation('update')
                setUpdatedProductID(product.id)
              }}>Update product</button>
              <button onClick={(e) => {
                handleDeleteProduct(product.id)
              }}>Delete product</button>
            </li>
          )
        })}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default App;
