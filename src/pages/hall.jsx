import Button from "../components/Button";
import Header from "../components/Header";
import Card from "../components/Card";
import Input from "../components/Input";
import { codeError } from "../services/error";
import TemplateOrder from "../components/TemplateOrder";
import { getProduct, createOrder } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Hall() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ client: "", table: "" });
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [error, setError] = useState("");
  console.log(error);
  // const [reference, setReference] = useState("");
  // const [request, setRequest] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function PushedProducts(option) {
    getProduct()
      .then((response) => response.json())
      .then((data) => {
        setProducts(
          data.filter((item) => {
            return item.type === option;
          })
        );
      });
  }

  useEffect(() => {
    PushedProducts("breakfast");
  }, []);

  const handleInfo = (e) => {
    return setInfo(() => {
      const auxInfo = { ...info };
      auxInfo[e.target.name] = e.target.value;
      return auxInfo;
    });
  };

  function handleProduct(product) {
    const newOrder = order;
    const productList = newOrder.find((item) => {
      return item.id === product.id;
    });
    if (productList) {
      productList.qtd += 1;
    } else {
      const newList = {
        id: product.id,
        name: product.name,
        price: product.price,
        flavor: product.flavor,
        qtd: 1,
      };
      newOrder.push(newList);
    }
    setOrder([...newOrder]);
  }

  function finalOrder() {
    function listOrder() {
      const openTable = {
        client: info.client,
        table: info.table,
        products: order.map((item) => {
          const infosOrder = {
            id: item.id,
            name: item.name,
            price: item.price,
            flavor: item.flavor,
            qtd: 1,
          };
          return infosOrder;
        }),
      };
      return openTable;
    }

    const resumeOrder = listOrder();
    console.log(resumeOrder);

    createOrder(resumeOrder)
      .then(() => {
        navigate("/kitchen");
      })
      .catch((error) => {
        setError(codeError(error));
      });
  }

  function handleRemoveItem(item) {
    const productInList = order.find((element) => element.id === item.id);

    if (productInList) {
      if (productInList.qtd === 1) {
        order.splice(
          order.findIndex((element) => element.id === item.id),
          1
        );
        productInList.qtd = 0;
      }
      if (productInList.qtd > 1) {
        productInList.qtd -= 1;
      }
    }
    setOrder([...order]);
  }

  function totalValue() {
    const wholeAmount = [];
    for (let i = 0; i < order.length; i++) {
      const totalSum = order[i].qtd * order[i].price;
      wholeAmount.push(totalSum);
    }
    const valueInitial = 0;
    const wholeInitial = wholeAmount.reduce(
      (value, currentValue) => value + currentValue,
      valueInitial
    );
    return wholeInitial;
  }
  return (
    <div>
      <Header children="PEDIDOS" />
      <Button children="CAFÉ" onClick={() => PushedProducts("breakfast")} />
      <Button children="+ MENU" onClick={() => PushedProducts("all-day")} />
      <section className='sectionCard'>
        {products.map((item) => {
          return (
            <Card
              key={item.id}
              product={item}
              onClick={() => handleProduct(item)}
            />
          );
        })}
      </section>
      <div className="InfoClient">
        <Input
          placeholder="CLIENTE"
          type="text"
          name="client"
          value={info.client}
          onChange={handleInfo}
        />
        <Input
          placeholder="MESA"
          type="text"
          name="table"
          value={info.table}
          onChange={handleInfo}
        />
      </div>
      <section className='sectionOrder'>     
        {order.map((item) => {
          return (
            <TemplateOrder
              key={item.id}
              product={item}
              onClickRemove={() => handleRemoveItem(item)}
            />
          );
        })}
        <p> VALOR TOTAL: R${totalValue().toFixed(2)}</p>
      </section>
      <button children="Cancelar" id="cancel" onClick={handleLogout}></button>
      <button children="Confirmar" id="confirm" onClick={handleLogout}></button>
      <Button children="Sair" onClick={handleLogout} />

    </div>
  );
}
export default Hall;