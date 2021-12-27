import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Table, Pagination, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

//axios
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/userSlice";
const { Header, Content, Footer } = Layout;

const Products = () => {
  //Getting token from redux store
  const user = useSelector((state) => state.user.user);
  const [tableData, setTableData] = useState(null);
  const [dataCount, setDataCount] = useState(null);
  useEffect(() => {
    getPage(1, 10);
  }, [user]);

  //Get url
  const baseUrl = "https://face.ox-sys.com/variations";

  //get current page number
  const getPage = async (page, pageSize) => {
    await axios
      .post(
        baseUrl,
        {
          size: pageSize,
          page: page,
          stock: {
            exist: true,
            location: [42],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        setTableData(
          res.data.items.map((data, index) => {
            return {
              key: index,
              name: data.name,
              size: data.properties[0].value,
              supplier: data.supplier,
              UZS: `${data.importRecord.landedCostPrice.UZS} SUM`,
              USD: data.importRecord.landedCostPrice.USD,
              unit: data.unit,
            };
          })
        );
        setDataCount(res.data.total_count);
      });
  };

  //Search item handler
  const searchItems = (e) => {
    const searchTerm = e.target.value;
    let resultData = tableData;
    if (searchTerm !== "") {
      resultData = tableData
        .filter((data) => {
          return data.name.toLowerCase().includes(searchTerm);
        })
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      setTableData(resultData);
    }
  };
  return (
    <Layout className="layout">
      <Header className=" bg-white">
        <Menu theme="light" mode="horizontal" className="flex items-center">
          <Menu.Item key={1}>
            <h3 className="text-2xl text-center">Products page</h3>
          </Menu.Item>
          <Menu.Item key={2}>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
              }}
            >
              Log out
            </Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="px-16 bg-gray-600 ">
        <div className="h-full w-10/12 mx-auto bg-slate-300 text-center flex flex-col items-center ">
          <h3 className="text-center text-lg text-gray-900 py-6 ">
            Product list table.
          </h3>
          <Input
            placeholder="Search items"
            prefix={<SearchOutlined />}
            className="py-4"
            onChange={searchItems}
          />
          <table className="w-full text-left px-6 bg-slate-50 text-neutral-700 border border-black border-solid custom-table">
            <thead className="border my-6">
              <tr>
                <th>Name</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData?.map((data) => (
                  <tr key={data.key} className="!py-6 border border-collapse">
                    <td>{data.name}</td>
                    <td>{data.supplier}</td>
                    <td>{data.UZS}</td>
                    <td>{data.unit}</td>
                    <td>{data.size}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {dataCount !== null && (
            <Pagination
              defaultCurrent={1}
              total={dataCount}
              onChange={getPage}
              className="py-12"
            ></Pagination>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Products;
