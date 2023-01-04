	.data
data1:	.word	100
data2:	.word	200
data3:	.word	0x12345678
	.text
main:
	and	$17, $17, $0
	and	$18, $18, $0
	la	$8, data1
	la	$9, data2
	and	$10, $10, $0
lab1:
	and	$11, $11, $0
lab2:
	addi	$17, $17, 0x1
	addi	$11, $11, 0x1
	or	$9, $9, $0
	bne	$11, $8, lab2
lab3:
	addi	$18, $18, 0x2
	addi	$11, $11, 1
	sll	$18, $17, 1
	srl	$17, $18, 1
	and	$19, $17, $18
	bne	$11, $9, lab3
lab4:
	add	$5, $5, $31
	nor	$16, $17, $18
	beq	$10, $8, lab5
	j	lab1
lab5:
	ori	$16, $16, 0xf0f0