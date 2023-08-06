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
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  persistentAPIToken: Yup.string().required('Required'),
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async ({ persistentAPIToken }) => {
    setIsLoading(true);

    try {
      localStorage.setItem('accessToken', persistentAPIToken);
      router.push('/');
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
      persistentAPIToken: '',
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
              Persistent API Token
            </FormLabel>
            <Input
              type="password"
              id="persistentAPIToken"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.persistentAPIToken && (
              <FormErrorMessage>
                {errors.persistentAPIToken}
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