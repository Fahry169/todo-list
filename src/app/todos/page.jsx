"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { Button } from "@nextui-org/react";

const Page = () => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/getTodos/${session.data?.user?.id}`,
        { next: { revalidate: 3 } }
      );
      const data = await response.json();
      setTodos(data.body)
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleAddTodo = async () => {
    await fetch("/api/v1/pushTodo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          title: "New Task",
          userId: session.data.user.id,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [session.data]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center">
          <div className="my-8 flex justify-center">
            <Button
              onClick={() => handleAddTodo()}
              radius="sm"
              className="bg-orange-200"
            >
              + Add new task
            </Button>
          </div>
          <div className="w-[800px] mx-auto flex flex-col gap-8">
            {todos.map((todo) => {
              return (
                
                <h1>{todo.id}</h1>
              )
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
