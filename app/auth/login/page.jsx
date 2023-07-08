'use client'

import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  chakra,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('accessToken', data.accessToken);
      // router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: onSubmit,
    validationSchema,
  })

  return (
    <Card
      boxShadow="2xl"
    >
      <CardBody
        display="flex"
        flexDir="column"
        gap="1rem"
      >
        <Text
          fontSize="2xl"
        >
          Sign in
        </Text>
        <chakra.form
          display="flex"
          flexDir="column"
          onSubmit={handleSubmit}
          gap="1rem"
        >
          <FormControl>
            <FormLabel>
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <FormErrorMessage>
                {errors.email}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>
              Password
            </FormLabel>
            <Input
              type="password"
              id="password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <FormErrorMessage>
                {errors.password}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </chakra.form>
      </CardBody>
    </Card>
  )
}