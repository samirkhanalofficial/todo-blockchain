"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import abi from "./abi.json";
import { ethers, BrowserProvider } from "ethers";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { toast } = useToast();
  const [todos, setTodos] = useState<string[]>([]);
  const [todo, setTodo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  useMemo(() => {
    getTodos();
  }, []);
  if (!window) return;

  const provider = new BrowserProvider((window as any).ethereum);
  const deployAddress = "0x00a4efd81C06Cd3871cF8341fC494210DDEbe789";
  async function addToDo() {
    if (loading) return;
    setLoading(true);
    const signer = await provider.getSigner();
    const mycontract = new ethers.Contract(deployAddress, abi, signer);
    await mycontract
      .addTodo(todo)
      .then((res) => {
        console.log(res);
        setTodos([...todos, todo]);
        setTodo("");
        toast({
          title: "TODO added successfully",
          description: todo,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error Adding Todo",
          description: todo,
        });
      })
      .finally(() => setLoading(false));
  }
  async function deleteTodo(index: number) {
    if (loading) return;
    setLoading(true);
    const signer = await provider.getSigner();
    const mycontract = new ethers.Contract(deployAddress, abi, signer);
    const deletingTodo = todos[index];
    await mycontract
      .removeTodos(index)
      .then((res) => {
        console.log(res);
        setTodos((prev) => {
          return prev.filter((_, i: number) => i !== index);
        });
        setTodo("");
        toast({
          variant: "destructive",

          title: "TODO deleted successfully (" + index,
          description: deletingTodo,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error Deleting Todo",
          description: deletingTodo,
        });
      })
      .finally(() => setLoading(false));
  }
  async function getTodos() {
    if (loading) return;
    setLoading(true);
    try {
      const mycontract = new ethers.Contract(deployAddress, abi, provider);
      const todos = await mycontract.getTodos();
      setTodos(todos);
      setLoading(false);
    } catch (e) {
      setLoading(false);

      toast({
        title: "Error Getting Todos",
        description: "Please install metamask and refresh the page.",
      });
    }
  }

  return (
    <main className="p-5">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          addToDo();
        }}
        className=" flex space-x-2"
      >
        <Input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="eg. study physics for 30minutes"
        />

        <Button>Add Todo</Button>
      </form>
      <br />
      <br />
      {/* <center>List of your TODOS.</center> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Todos</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {todos.toReversed().map((todo, index) => (
            <TableRow key={todo + index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{todo}</TableCell>
              <TableCell>
                <Button onClick={() => deleteTodo(todos.length - 1 - index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && (
        <div className="w-full p-5 flex items-center justify-center">
          <ScaleLoader color="black" />
        </div>
      )}
    </main>
  );
}
