'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns/format'
import { ArrowLeft, CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// import { NewCashFlowType } from '@/app/[kakeiboId]/payment/page'
import { Category } from '@prisma/client'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function Payment({
  categories,
  createNewCashFlow,
}: //
{
  categories: Category[]
  createNewCashFlow: (cashFlow: any) => void
}) {
  const kakeiboId = useParams().kakeiboId
  const router = useRouter()

  const CashFlowSchema = z.object({
    timestamp: z
      .date()
      .optional()
      .default(() => new Date()), // デフォルトで現在時刻
    price: z.number(), // 金額は正の数
    memo: z.string(),
    categoryId: z.string().uuid().nullable(), // オプショナルなカテゴリID
  })

  const form = useForm<z.infer<typeof CashFlowSchema>>({
    resolver: zodResolver(CashFlowSchema),
    defaultValues: {
      timestamp: new Date(),
      price: 0,
      memo: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CashFlowSchema>) => {
    await createNewCashFlow(values)
    toast({
      title: `支出追加: ${values.price}`,
      description: <>{`メモ: ${values.memo}`}</>,
    })
    router.push(`/${kakeiboId}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <header className="grid grid-cols-3 items-center">
          <Link href={`/${kakeiboId}`}>
            <ArrowLeft />
          </Link>
          <p className="text-center text-xl">入力</p>
          <div className="ml-auto">
            <Button variant="ghost" type="submit">
              完了
            </Button>
          </div>
        </header>
        <Tabs defaultValue="account" className="flex justify-center mt-3">
          <TabsList>
            <TabsTrigger value="account">支出</TabsTrigger>
            <TabsTrigger value="password">収入</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="bg-beige flex flex-col items-center py-4">
          {/* <!-- Content --> */}
          <div className="bg-beige-light w-11/12 max-w-md rounded-md p-4">
            {/* <!-- Form Fields --> */}
            <div className="space-y-6">
              {/* <!-- Date Field --> */}

              <FormField
                control={form.control}
                name="timestamp"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>日付</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full border-dotted border-2 border-primary p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>日付を選択</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        記録する日付を選択してください。（初期値は今日の日付です。）
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              {/* <!-- Amount Field --> */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>金額</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full border-dotted border-2 border-primary p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        type="number"
                        placeholder="¥ 0"
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : Number(value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <!-- Category Field --> */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリー</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="">
                      {/* {field.value} */}
                      <FormControl>
                        <SelectTrigger className="w-full border-dotted border-2 border-primary p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                          <SelectValue placeholder="カテゴリーを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      カテゴリーを選択してください。
                      {/* <Link href="/examples/forms">email settings</Link>. */}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <!-- Memo Field --> */}
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メモ</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full border-dotted border-2 border-primary p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="メモを書く"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
